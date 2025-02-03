

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllPendingRequestsByGroupIdHandler : IRequestHandler<GetAllJoinGroupRequestByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllPendingRequestsByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllJoinGroupRequestByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var (joinRequests, totalCount) = await _unitOfWork.JoinGroupRequestRepository
                .GetPendingJoinGroupRequestedAsync(request.GroupId, request.Page, request.Size);

            var response = joinRequests.Select(ApplicationMapper.MapToJoinGroupRequest).ToList();

            return new PaginationResponse<List<JoinGroupRequestResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy tất cả yêu cầu thành viên thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size <= totalCount,
                    Size = request.Size,
                    Page = request.Page,
                }
            };
        }
    }
}
