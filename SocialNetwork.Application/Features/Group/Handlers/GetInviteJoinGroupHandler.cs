

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetInviteJoinGroupHandler : IRequestHandler<GetInviteJoinGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetInviteJoinGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetInviteJoinGroupQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var inviteJoinGroup = await _unitOfWork
                .GroupInvitationRepository.GetGroupInvitationByInviteeIdAndGroupIdAsync(userId, request.GroupId)
                ?? throw new NotFoundException("Chưa ai mời bạn tham gia nhóm");

            return new DataResponse<GroupInvitationRespone>()
            {
                Data = ApplicationMapper.MapToGroupInvitation(inviteJoinGroup),
                IsSuccess = true,
                Message = "Lấy thông tin lời mời thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
