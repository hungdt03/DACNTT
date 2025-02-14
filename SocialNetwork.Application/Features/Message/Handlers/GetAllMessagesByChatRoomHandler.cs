
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Message.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Message.Handlers
{
    public class GetAllMessagesByChatRoomHandler : IRequestHandler<GetAllMessagesByChatRoomQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllMessagesByChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllMessagesByChatRoomQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var chatRoomMember = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(request.ChatRoomId, userId)
                ?? throw new NotFoundException("Chỉ có thành viên của đoạn chat mới được xem danh sách tin nhắn");

            var (messages, totalCount) = await _unitOfWork.MessageRepository.GetAllMessagesByChatRoomIdAsync(request.ChatRoomId, request.Page, request.Size);
            var response = new List<MessageResponse>();
           
            foreach(var message in messages)
            {
                if (message.SenderId == userId)
                {
                    message.Reads = message.Reads.Where(r => r.User.Id != userId).ToList();
                }

                var item = ApplicationMapper.MapToMessage(message);
              
                response.Add(item);
            }

            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<MessageResponse>>
            {
                Data = response,
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy danh sách tin nhắn thành công",
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = hasMore,
                }
            };
        }
    }
}
