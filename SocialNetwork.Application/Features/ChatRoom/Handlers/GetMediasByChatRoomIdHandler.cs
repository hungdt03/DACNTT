
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class GetMediasByChatRoomIdHandler : IRequestHandler<GetMediasByChatRoomIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetMediasByChatRoomIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetMediasByChatRoomIdQuery request, CancellationToken cancellationToken)
        {
            var (medias, totalCount) = await _unitOfWork.MessageMediaRepository
                 .GetAllMessageMediasByChatRoomIdAsync(request.ChatRoomId, request.Page, request.Size);

            var mediaResponse = medias.Select(m => ApplicationMapper.MapToMessageMedia(m)).ToList();
            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<MediaResponse>>
            {
                Data = mediaResponse,
                IsSuccess = true,
                Message = "Lấy các file phương tiện thành công",
                Pagination = new Pagination()
                {
                    HasMore = hasMore,
                    Page = request.Page,
                    Size = request.Size,
                    TotalPages = (int)Math.Ceiling(totalCount * 1.0 / request.Size)
                }
            };
        }
    }
}
