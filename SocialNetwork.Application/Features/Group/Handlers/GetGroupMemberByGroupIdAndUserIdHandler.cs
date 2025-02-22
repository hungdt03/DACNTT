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
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetGroupMemberByGroupIdAndUserIdHandler : IRequestHandler<GetGroupMemberByGroupIdAndUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetGroupMemberByGroupIdAndUserIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetGroupMemberByGroupIdAndUserIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            
            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(request.GroupId, request.UserId)
                ?? throw new AppException("Không tìm thấy thông tin nào");

            var meInGroup = await _unitOfWork
              .GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);


            var checkBlock = await _unitOfWork.BlockListRepository
                   .GetBlockListByUserIdAndUserIdAsync(member.UserId, userId);

            if (checkBlock != null && (meInGroup == null || meInGroup.Role == MemberRole.MEMBER)) throw new AppException("Không tìm thấy thông tin nào");


            var mapMember = ApplicationMapper.MapToGroupMember(member);
            if (userId != request.UserId)
            {
                var friendShip = await _unitOfWork.FriendShipRepository
                    .GetFriendShipByUserIdAndFriendIdAsync(userId, request.UserId);

                if(friendShip == null || !friendShip.IsConnect)
                {
                    mapMember.User.IsShowStatus = false;
                    mapMember.User.IsOnline = false;
                }
            }

            var haveStory = await _unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(member.UserId);
            mapMember.User.HaveStory = haveStory;

            return new DataResponse<GroupMemberResponse>()
            {
                Data = mapMember,
                IsSuccess = true,
                Message = "Lấy thông tin thành viên thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
