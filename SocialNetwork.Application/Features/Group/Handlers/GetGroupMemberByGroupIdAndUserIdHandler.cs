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

            var meInGroup = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(member.GroupId, userId);

            if (meInGroup == null && member.Group.Privacy == GroupPrivacy.PRIVATE)
                throw new AppException("Quyền truy cập bị từ chối");

            return new DataResponse<GroupMemberResponse>()
            {
                Data = ApplicationMapper.MapToGroupMember(member),
                IsSuccess = true,
                Message = "Lấy thông tin thành viên thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
