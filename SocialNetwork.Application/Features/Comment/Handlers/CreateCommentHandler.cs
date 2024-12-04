
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Comment.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class CreateCommentHandler : IRequestHandler<CreateCommentCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.User> userManager;
        private readonly ICloudinaryService _cloudinaryService;

        public CreateCommentHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.User> userManager, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            this.userManager = userManager;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Bài viết không tồn tại");

            var currentUser = await userManager.FindByIdAsync(userId);

            var comment = new Domain.Entity.Comment()
            {
                Content = request.Content,
                UserId = currentUser.Id,
                PostId = request.PostId,
            };

            if(request.File != null)
            {
                if (FileValidationHelper.IsImageFile(request.File))
                {
                    var url = await _cloudinaryService.UploadImageAsync(request.File);
                    comment.MediaType = MediaType.IMAGE;
                    comment.MediaUrl = url;
                }
                else if (FileValidationHelper.IsVideoFile(request.File))
                {
                    var url = await _cloudinaryService.UploadVideoAsync(request.File);
                    comment.MediaType = MediaType.VIDEO;
                    comment.MediaUrl = url;
                }
                else throw new AppException("Tập tin không được hỗ trợ");
            }

            if (request.ReplyToUserId != userId && !string.IsNullOrEmpty(request.ReplyToUserId))
            {
                var user = await userManager.FindByIdAsync(request.ReplyToUserId)
                    ?? throw new AppException("Thông tin người phản hồi không tồn tại");

                comment.ReplyToUserId = request.ReplyToUserId;
                comment.ReplyToUserName = user.FullName;

            }

            if (request.ParentCommentId != null && request.ParentCommentId != Guid.Empty)
            {
                var parentComment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(request.ParentCommentId.Value)
                    ?? throw new AppException("Parent comment không tồn tại");

                int parentCommentLevel = await GetCommentLevelAsync(request.ParentCommentId.Value);

                if (parentCommentLevel >= 3)
                {
                    if (parentComment.ParentCommentId.HasValue)
                    {
                        var grandParentComment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(parentComment.ParentCommentId.Value)
                            ?? throw new AppException("Grandparent comment không tồn tại");

                        comment.ParentCommentId = parentComment.ParentCommentId;
                    }
                    else
                    {
                        throw new AppException("Không thể tạo comment con của comment đã ở cấp độ cao nhất");
                    }
                }
                else
                {
                    comment.ParentCommentId = request.ParentCommentId;
                }
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            var savedComment = await _unitOfWork.CommentRepository.CreateCommentAsync(comment);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var response = ApplicationMapper.MapToComment(savedComment);
            return new DataResponse<CommentResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Tải bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<int> GetCommentLevelAsync(Guid commentId)
        {
            var comment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(commentId);

            if (comment == null)
            {
                throw new AppException("Comment không tồn tại");
            }

            if (comment.ParentCommentId == null)
            {
                return 1;  
            }

            return await GetCommentLevelAsync(comment.ParentCommentId.Value) + 1;
        }

    }
}
