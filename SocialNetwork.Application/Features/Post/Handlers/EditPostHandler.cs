﻿

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class EditPostHandler : IRequestHandler<EditPostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudinaryService _cloudinaryService;

        public EditPostHandler(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(EditPostCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (request.Post.RemoveMediaIds != null &&  request.Post.RemoveMediaIds.Count > 0)
            {
                foreach(var item in post.Medias)
                {
                    if(request.Post.RemoveMediaIds.Contains(item.Id))
                    {
                        var media = await _unitOfWork.PostMediaRepository.GetPostMediaByIdAsync(item.Id);
                        if (media == null) continue;

                        _unitOfWork.PostMediaRepository.DeletePostMedia(media);
                    }
                }
            }

            var medias = new List<PostMedia>();
            

            if (request.Post.Images != null && request.Post.Images.Count > 0)
            {
                var images = await _cloudinaryService.UploadMultipleImagesAsync(request.Post.Images);
                medias.AddRange(images.Select(image => new PostMedia
                {
                    MediaType = MediaType.IMAGE,
                    MediaUrl = image
                }));
            }

            if (request.Post.Videos != null && request.Post.Videos.Count > 0)
            {
                var videos = await _cloudinaryService.UploadMultipleVideosAsync(request.Post.Videos);
                medias.AddRange(videos.Select(video => new PostMedia
                {
                    MediaType = MediaType.VIDEO,
                    MediaUrl = video
                }));
            }

            post.Content = request.Post.Content;
            post.Privacy = request.Post.Privacy;
            post.Medias = (post.Medias ?? new List<PostMedia>()).Concat(medias).ToList();

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Cập nhật bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
