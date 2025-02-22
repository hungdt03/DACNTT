
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllMembersByGroupIdHandler : IRequestHandler<GetAllMembersByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllMembersByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllMembersByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (groupMembers, totalCount) = await _unitOfWork.GroupMemberRepository.GetAllMembersInGroupAsync(request.GroupId, request.Page, request.Size, request.Query, request.Role);
            
            var meInGroup = await _unitOfWork
                .GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            var response = new List<GroupMemberResponse>();

            foreach (var groupMember in groupMembers)
            {
                var checkBlock = await _unitOfWork.BlockListRepository
                    .GetBlockListByUserIdAndUserIdAsync(groupMember.UserId, userId);

                if (checkBlock != null && (meInGroup == null || meInGroup.Role == MemberRole.MEMBER)) continue;

                var responseItem = ApplicationMapper.MapToGroupMember(groupMember);

                var adminInvitation = await _unitOfWork.GroupRoleInvitationRepository
                    .GetAdminInvitationByInviteeAndGroupIdAsync(groupMember.UserId, groupMember.GroupId);

                var moderator = await _unitOfWork.GroupRoleInvitationRepository
                   .GetModeratorInvitationByInviteeAndGroupIdAsync(groupMember.UserId, groupMember.GroupId);

                if(adminInvitation != null)
                {
                    responseItem.IsInvitedAsModerator = false;
                    responseItem.IsInvitedAsAdmin = true;
                } else if(moderator != null) 
                {
                    responseItem.IsInvitedAsModerator = true;
                    responseItem.IsInvitedAsAdmin = false;
                }

                response.Add(responseItem);

            }

            return new PaginationResponse<List<GroupMemberResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy tất cả thành viên của nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Size * request.Page < totalCount
                }
            };
        }
    }
}
