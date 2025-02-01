using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetGroupPostMediaByGroupIdHandler : IRequestHandler<GetGroupPostMediaByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetGroupPostMediaByGroupIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetGroupPostMediaByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var (medias, totalCount) = await _unitOfWork.PostMediaRepository.GetAllGroupPostMediaByGroupIdAsync(request.GroupId, request.Page, request.Size);

            var response = medias.Select(media => ApplicationMapper.MapToPostMedia(media)).ToList();
            return new PaginationResponse<List<MediaResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách file phương tiện trong nhóm thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                }
        };
        }
    }
}
