﻿using MediatR;
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
    public class GetGroupByIdHandler : IRequestHandler<GetGroupByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetGroupByIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor) {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Không tìm thấy thông tin nhóm");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var groupMember = group.Members.SingleOrDefault(s => s.UserId == userId);
            var response = ApplicationMapper.MapToGroup(group);
            response.AdminCount = await _unitOfWork.GroupMemberRepository
                .CountAdminsByGroupIdAsync(request.GroupId);

            var todayPosts = await _unitOfWork.PostRepository
                .CountTodayPostsByGroupIdAsync(request.GroupId);

            response.CountTodayPosts = todayPosts;
            response.CountMembers = await _unitOfWork.GroupMemberRepository.CountGroupMembersByGroupIdAsync(request.GroupId);

            response.FriendMembers = [];
            foreach (var friend in group.Members)
            {
                if (friend.UserId == userId) continue;
                var friendShip = await _unitOfWork.FriendShipRepository
                    .GetFriendShipByUserIdAndFriendIdAsync(friend.UserId, userId, FriendShipStatus.ACCEPTED);

                response.FriendMembers.Add(ApplicationMapper.MapToUser(friend.User));
            }
            
            if (groupMember != null)
            {
                response.IsMine = groupMember.Role == MemberRole.ADMIN;
                response.IsModerator = groupMember.Role == MemberRole.MODERATOR;
                response.IsMember = true;
            }

            return new DataResponse<GroupResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
