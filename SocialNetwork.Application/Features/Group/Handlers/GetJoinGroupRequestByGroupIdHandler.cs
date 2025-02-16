
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetJoinGroupRequestByGroupIdHandler : IRequestHandler<GetJoinGroupRequestByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetJoinGroupRequestByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(GetJoinGroupRequestByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var joinGroupRequest = await _unitOfWork.JoinGroupRequestRepository.GetJoinGroupRequestByUserIdAndGroupIdAsync(userId, request.GroupId)
                ?? throw new NotFoundException("Không tìm thấy yêu cầu nào");

            return new DataResponse<JoinGroupRequestResponse>()
            {
                IsSuccess = true,
                Message = "Lấy yêu cầu tham gia nhóm thành công",
                Data = ApplicationMapper.MapToJoinGroupRequest(joinGroupRequest),
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
