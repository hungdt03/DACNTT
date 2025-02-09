
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
    public class GetRoleInvitationByGroupIdHandler : IRequestHandler<GetRoleInvitationByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetRoleInvitationByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetRoleInvitationByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var roleInvitation = await _unitOfWork.GroupRoleInvitationRepository
                .GetInvitationByInviteeAndGroupIdAsync(userId, request.GroupId)
                    ?? throw new NotFoundException("Không có lời mời nào");


            return new DataResponse<GroupRoleInvitationResponse>()
            {
                Data = ApplicationMapper.MapToGroupRoleInvitation(roleInvitation),
                IsSuccess = true,
                Message = "Lấy lời mời thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
