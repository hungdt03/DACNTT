
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Report.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class GetAllPendingReportsByGroupIdHandler : IRequestHandler<GetAllPendingReportsByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllPendingReportsByGroupIdHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllPendingReportsByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (reports, totalCount) = await _unitOfWork.ReportRepository
                .GetAllPendingReportsByGroupIdAsync(request.GroupId, request.Page, request.Size);

            var response = new List<ReportResponse>();
            foreach (var item in reports)
            {
                var responseItem = ApplicationMapper.MapToReport(item);
                if(item.ReportType == ReportType.USER && item.TargetUserId != null)
                {
                    var haveStory = await _unitOfWork.StoryRepository.IsUserHaveStoryAsync(item.TargetUserId);
                    responseItem.TargetUser.HaveStory = haveStory;
                } else if(item.ReportType == ReportType.POST && item.TargetPostId != null)
                {
                    var haveStory = await _unitOfWork.StoryRepository.IsUserHaveStoryAsync(item.TargetPost.UserId);
                    responseItem.TargetPost.User.HaveStory = haveStory;
                }

               response.Add(responseItem);
            }

            return new PaginationResponse<List<ReportResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy dữ liệu báo cáo của nhóm thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                }
            };

        }
    }
}
