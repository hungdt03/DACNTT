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
            var isAdmin = group.Members.Any(s => s.UserId == userId && s.IsAdmin);
            var response = ApplicationMapper.MapToGroup(group);
            response.IsMine = isAdmin;

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
