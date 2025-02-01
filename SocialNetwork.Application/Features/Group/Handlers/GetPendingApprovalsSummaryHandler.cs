
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetPendingApprovalsSummaryHandler : IRequestHandler<GetPendingApprovalsSummaryQuery, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public GetPendingApprovalsSummaryHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetPendingApprovalsSummaryQuery request, CancellationToken cancellationToken)
        {
            var countPendingRequestJoinGroup = await _unitOfWork.JoinGroupRequestRepository.CountPendingJoinGroupRequestedAsync(request.GroupId);
            var countPendingPosts = await _unitOfWork.PostRepository.CountPendingPostsByGroupIdAsync(request.GroupId);

            var response = new GroupApprovalSummaryResponse()
            {
                PendingPost = countPendingPosts,
                PendingRequestJoinGroup = countPendingRequestJoinGroup,
            };

            return new DataResponse<GroupApprovalSummaryResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin các bài viết / yêu cầu làm thành viên đang chờ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
