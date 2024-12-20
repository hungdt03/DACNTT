
using MediatR;
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

        public GetAllMessagesByChatRoomHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllMessagesByChatRoomQuery request, CancellationToken cancellationToken)
        {
            var messages = await _unitOfWork.MessageRepository.GetAllMessagesByChatRoomIdAsync(request.ChatRoomId);
            var response = messages.Select(ApplicationMapper.MapToMessage).ToList();

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
