
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Reaction.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Reaction.Handlers
{
    public class GetAllReactionsByPostIdHandler : IRequestHandler<GetAllReactionsByPostIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllReactionsByPostIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllReactionsByPostIdQuery request, CancellationToken cancellationToken)
        {
            var reactions = await _unitOfWork.ReactionRepository.GetAllReactionsByPostIdAsync(request.PostId);
            var response = reactions.Select(ApplicationMapper.MapToReaction).ToList();

            return new DataResponse<List<ReactionResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách tương tác bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
