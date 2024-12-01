
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;
using static System.Net.Mime.MediaTypeNames;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class CreatePostHandler : IRequestHandler<CreatePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudinaryService cloudinaryService;
        private readonly IHttpContextAccessor _contextAccessor;

        public CreatePostHandler(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            this.cloudinaryService = cloudinaryService;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var medias = new List<PostMedia>();

            if(request.Images != null && request.Images.Count > 0)
            {
                var images = await cloudinaryService.UploadMultipleImagesAsync(request.Images);
                medias.AddRange(images.Select(image => new PostMedia
                {
                    MediaType = MediaType.IMAGE,
                    MediaUrl = image
                }));
            }

            if (request.Videos != null && request.Videos.Count > 0)
            {
                var videos = await cloudinaryService.UploadMultipleVideosAsync(request.Videos);
                medias.AddRange(videos.Select(video => new PostMedia
                {
                    MediaType = MediaType.VIDEO,
                    MediaUrl = video
                }));
            }

            var post = new SocialNetwork.Domain.Entity.Post
            {
                Content = request.Content,
                Medias = medias,
                PostType = PostType.ORIGINAL_POST,
                Privacy = request.Privacy,
                UserId = _contextAccessor.HttpContext.User.GetUserId(),
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.PostRepository.CreatePostAsync(post);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Tạo bài viết mới thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
