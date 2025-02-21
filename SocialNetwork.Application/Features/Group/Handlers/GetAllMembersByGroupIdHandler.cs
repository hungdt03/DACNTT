﻿
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllMembersByGroupIdHandler : IRequestHandler<GetAllMembersByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllMembersByGroupIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllMembersByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var (groupMembers, totalCount) = await _unitOfWork.GroupMemberRepository.GetAllMembersInGroupAsync(request.GroupId, request.Page, request.Size, request.Query, request.Role);
            
            var response = new List<GroupMemberResponse>();

            foreach (var groupMember in groupMembers)
            {
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
