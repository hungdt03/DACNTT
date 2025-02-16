

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllPendingInviteMembersByGroupIdHandler : IRequestHandler<GetAllPendingInviteMembersByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllPendingInviteMembersByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllPendingInviteMembersByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (groupMember == null || groupMember.Role == MemberRole.MEMBER)
                throw new AppException("Quyền truy cập bị từ chối");

            var (inviteMembers, totalCount) = await _unitOfWork.GroupInvitationRepository
                .GetAllPendingInvitationsByGroupIdAsync(request.GroupId, request.Page, request.Size);

            var response = inviteMembers.Select(ApplicationMapper.MapToGroupInvitation).ToList();

            return new PaginationResponse<List<GroupInvitationRespone>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách các yêu cầu đang chờ phê duyệt",
                StatusCode = System.Net.HttpStatusCode.OK,
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
