
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetPostByIdHandler : IRequestHandler<GetPostByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetPostByIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết");

           
            var response = ApplicationMapper.MapToPost(post);

            if (post.PostType == PostType.ORIGINAL_POST)
            {
                var shares = await _unitOfWork.PostRepository.CountSharesByPostIdAsync(post.Id);
                response.Shares = shares;
            }

            var haveStory = await _unitOfWork.StoryRepository
                    .IsUserHaveStoryAsync(post.UserId);
            response.User.HaveStory = haveStory;

            return new DataResponse<PostResponse>
            {
                Data = response,
                Message = "Lấy dữ liệu bài viết thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
