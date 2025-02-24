using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Common;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class UpdateReportHandler : IRequestHandler<UpdateReportCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;
        private readonly IConfiguration _configuration;

        public UpdateReportHandler(ISignalRService signalRService, IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
            _configuration = configuration;
        }

        public async Task<BaseResponse> Handle(UpdateReportCommand request, CancellationToken cancellationToken)
        {
            if (request.NewStatus != ReportStatus.REJECTED && request.NewStatus != ReportStatus.RESOLVED)
                throw new AppException("Trạng thái cập nhật không phù hợp");

            var report = await _unitOfWork.ReportRepository.GetReportByIdAsync(request.Id)
                ?? throw new AppException("Report này không tồn tại");

            if (report.GroupId != null) throw new AppException("Báo cáo không thuộc thẩm quyền giải quyết");

            if (report.Status != ReportStatus.PENDING) throw new AppException("Báo cáo này đã được giải quyết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            string responseContentForReporter = "";
            string responseContentForReportee = "";
            Domain.Entity.System.User? reportee = null;

            if (report.ReportType == ReportType.COMMENT && report.TargetCommentId.HasValue)
            {
                reportee = report.TargetComment.User;
                if (request.NewStatus == ReportStatus.RESOLVED)
                {
                    var comment = await _unitOfWork.CommentRepository
                        .GetCommentByIdAsync(report.TargetCommentId.Value)
                            ?? throw new AppException("Bình luận này có thể đã bị gỡ");

                    var replies = await _unitOfWork.CommentRepository.GetAllRepliesByCommentIdAsync(comment.Id);
                    foreach (var commentItem in replies)
                    {
                        commentItem.ParentCommentId = comment.ParentCommentId;
                    }

                    _unitOfWork.CommentRepository.DeleteComment(comment);

                    report.Status = ReportStatus.RESOLVED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi xác nhận rằng bình luận này vi phạm chính sách cộng đồng và đã tiến hành gỡ bỏ. Chúng tôi mong muốn tạo ra một môi trường thảo luận lành mạnh và tôn trọng. ";
                    responseContentForReportee = "Bình luận của bạn đã bị gỡ vì vi phạm chính sách cộng đồng. Vui lòng đảm bảo rằng các thảo luận luôn mang tính xây dựng và tôn trọng người khác.";
                } else if (request.NewStatus == ReportStatus.REJECTED)
                {
                    report.Status = ReportStatus.REJECTED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi nhận thấy bình luận này không vi phạm chính sách cộng đồng của chúng tôi, vì vậy sẽ không tiến hành gỡ bỏ. Tuy nhiên, chúng tôi luôn khuyến khích một môi trường thảo luận văn minh và tôn trọng lẫn nhau.";
                }

            } else if(report.ReportType == ReportType.POST && report.TargetPostId.HasValue)
            {
                reportee = report.TargetPost.User;
                if (request.NewStatus == ReportStatus.RESOLVED)
                {
                    var post = await _unitOfWork.PostRepository
                        .GetPostByIdAsync(report.TargetPostId.Value)
                            ?? throw new AppException("Bài viết này có thể đã bị gỡ");

                    var reactions = await _unitOfWork.ReactionRepository.GetAllReactionsByPostIdAsync(report.TargetPostId.Value);
                    var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAsync(report.TargetPostId.Value);
                    var sharePosts = await _unitOfWork.PostRepository.GetAllSharePostsByOriginalPostId(report.TargetPostId.Value);
                    var tags = await _unitOfWork.TagRepository.GetAllTagsByPostIdAsync(post.Id);

                    _unitOfWork.ReactionRepository.RemoveRange(reactions);
                    _unitOfWork.CommentRepository.RemoveRange(comments);
                    _unitOfWork.TagRepository.RemoveRange(tags);
                    UpdateSharedPosts(sharePosts, post);
                    _unitOfWork.PostRepository.DeletePost(post);

                    report.Status = ReportStatus.RESOLVED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi xác nhận rằng bài viết này vi phạm chính sách cộng đồng và đã tiến hành gỡ bỏ. Chúng tôi mong muốn tạo ra một môi trường thảo luận lành mạnh và tôn trọng. ";
                    responseContentForReportee = "Bài viết của bạn đã bị gỡ vì vi phạm chính sách cộng đồng. Vui lòng đảm bảo rằng các thảo luận luôn mang tính xây dựng và tôn trọng người khác. ";
                }
                else if (request.NewStatus == ReportStatus.REJECTED)
                {
                    report.Status = ReportStatus.REJECTED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi nhận thấy bài viết này không vi phạm chính sách cộng đồng của chúng tôi, vì vậy sẽ không tiến hành gỡ bỏ. Tuy nhiên, chúng tôi luôn khuyến khích một môi trường thảo luận văn minh và tôn trọng lẫn nhau.";
                }

            } else if (report.ReportType == ReportType.GROUP && report.TargetGroupId.HasValue)
            {
                if (request.NewStatus == ReportStatus.RESOLVED)
                {
                    var group = await _unitOfWork.GroupRepository
                        .GetGroupByIdAsync(report.TargetGroupId.Value)
                            ?? throw new AppException("Nhóm này có thể đã bị giải tán");

                    _unitOfWork.GroupRepository.RemoveGroup(group);

                    report.Status = ReportStatus.RESOLVED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi xác nhận rằng nhóm này có những nội dung vi phạm chính sách cộng đồng và đã tiến hành gỡ bỏ. Chúng tôi mong muốn tạo ra một môi trường thảo luận lành mạnh và tôn trọng.";
                }
                else if (request.NewStatus == ReportStatus.REJECTED)
                {
                    report.Status = ReportStatus.REJECTED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi nhận thấy nhóm này không vi phạm chính sách cộng đồng của chúng tôi, vì vậy sẽ không tiến hành gỡ bỏ. Tuy nhiên, chúng tôi luôn khuyến khích một môi trường thảo luận văn minh và tôn trọng lẫn nhau.";
                }
            } else if (report.ReportType == ReportType.USER && report.TargetUserId != null)
            {
                if (request.NewStatus == ReportStatus.RESOLVED)
                {
                    var user = await _unitOfWork.UserRepository
                        .GetUserByIdAsync(report.TargetUserId)
                            ?? throw new AppException("Không tìm thấy thông tin người dùng");

                    user.IsLock = true;
                    report.Status = ReportStatus.RESOLVED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi xác nhận rằng người dùng này có những nội dung vi phạm chính sách cộng đồng và đã tiến hành khóa tài khoản người này. Chúng tôi mong muốn tạo ra một môi trường thảo luận lành mạnh và tôn trọng. ";
                }
                else if (request.NewStatus == ReportStatus.REJECTED)
                {
                    report.Status = ReportStatus.REJECTED;
                    responseContentForReporter = "Cảm ơn bạn đã báo cáo. Sau khi xem xét, chúng tôi nhận thấy người dùng này không vi phạm chính sách cộng đồng của chúng tôi, vì vậy sẽ không tiến hành gỡ bỏ. Tuy nhiên, chúng tôi luôn khuyến khích một môi trường thảo luận văn minh và tôn trọng lẫn nhau.";
                }
            }

            report.ResolutionNotes = responseContentForReporter;
            var notiImage = _configuration["ServerHost"] + ShareConstant.PREFIX_FILE_API + ShareConstant.LOGO_FILENAME; ;
           
            var notiReporter = new Domain.Entity.System.Notification
            {
                ReportId = report?.Id,
                CommentId = report?.TargetCommentId,
                PostId = report?.TargetPostId,
                ImageUrl = notiImage,
                IsRead = false,
                Title = "Phản hồi báo cáo",
                Content = responseContentForReporter,
                RecipientId = report?.ReporterId,
                Recipient = report?.Reporter,
                Type = NotificationType.REPORT_RESPONSE_REPORTER,
                DateSent = DateTimeOffset.UtcNow
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiReporter);

            Domain.Entity.System.Notification? notiReportee = null;

            if(request.NewStatus == ReportStatus.RESOLVED && !string.IsNullOrEmpty(responseContentForReportee)) {
                notiReportee = new Domain.Entity.System.Notification
                {
                    ReportId = report?.Id,
                    CommentId = report?.TargetCommentId,
                    PostId = report?.TargetPostId,
                    ImageUrl = notiImage,
                    IsRead = false,
                    Title = "Thông báo gỡ nội dung",
                    Content = responseContentForReportee,
                    RecipientId = reportee?.Id,
                    Recipient = reportee,
                    Type = NotificationType.REPORT_RESPONSE_REPORTEE,
                    DateSent = DateTimeOffset.UtcNow
                };

                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiReportee);
            }
           
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendNotificationToSpecificUser(notiReporter.Recipient.UserName, ApplicationMapper.MapToNotification(notiReporter));

            if(notiReportee != null)
            {
                await _signalRService.SendNotificationToSpecificUser(notiReportee.Recipient.UserName, ApplicationMapper.MapToNotification(notiReportee));
            }

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Xử lí báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        private void UpdateSharedPosts(IEnumerable<Domain.Entity.PostInfo.Post> sharePosts, Domain.Entity.PostInfo.Post post)
        {
            foreach (var p in sharePosts)
            {
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    p.SharePostId = (p.SharePostId == p.OriginalPostId) ? null : p.SharePostId;
                    p.OriginalPostId = null;
                }
                else
                {
                    p.SharePostId = null;
                }
            }
        }

    }
}
