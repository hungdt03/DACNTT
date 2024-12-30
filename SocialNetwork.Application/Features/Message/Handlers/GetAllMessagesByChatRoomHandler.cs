
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
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
            var messages = await _unitOfWork.MessageRepository.GetAllMessagesByChatRoomIdAsync(request.ChatRoomId);
            var response = new List<MessageResponse>();
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            foreach(var message in messages)
            {
                if (message.SenderId == userId)
                {
                    message.Reads = message.Reads.Where(r => r.User.Id != userId).ToList();
                }
                var item = ApplicationMapper.MapToMessage(message);
              
                response.Add(item);
            }

            return new DataResponse<List<MessageResponse>>
            {
                Data = response,
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy danh sách tin nhắn thành công",
            };
        }
    }
}
