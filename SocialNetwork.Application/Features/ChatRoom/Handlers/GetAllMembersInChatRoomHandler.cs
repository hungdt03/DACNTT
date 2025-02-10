using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;


namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class GetAllMembersInChatRoomHandler : IRequestHandler<GetAllMembersInChatRoomQuery, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public GetAllMembersInChatRoomHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllMembersInChatRoomQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var userMember = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(request.ChatRoomId, userId)
                ?? throw new AppException("Chỉ có thành viên nhóm chat mới xem được danh sách thành viên");

            var members = await _unitOfWork.ChatRoomMemberRepository
                .GetAllMembersByChatRoomIdAsync(request.ChatRoomId);

            var response = members.Select(ApplicationMapper.MapToChatRoomMember).ToList();

            return new DataResponse<List<ChatRoomMemberResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách thành viên trong nhóm chat thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
