using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllInviteJoinGroupHandler : IRequestHandler<GetAllInviteJoinGroupByCurrentUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllInviteJoinGroupHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllInviteJoinGroupByCurrentUserQuery request, CancellationToken cancellationToken)
        {
            
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (invites, totalCount) = await _unitOfWork.GroupInvitationRepository
                .GetAllPendingInvitationsByInviteeIdAsync(userId, request.Page, request.Size);

            var response = invites.Select(ApplicationMapper.MapToGroupInvitation).ToList();

            return new PaginationResponse<List<GroupInvitationRespone>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách lời mời đang chờ thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size
                }
            };
        }
    }
}
