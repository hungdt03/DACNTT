﻿
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllPostsHandler : IRequestHandler<GetAllPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IHttpContextAccessor httpContextAccessor;

        public GetAllPostsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            this.unitOfWork = unitOfWork;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllPostQuery request, CancellationToken cancellationToken)
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserId();
            var (posts, totalCount) = await unitOfWork.PostRepository.GetAllPostsAsync(request.Page, request.Size, userId);

            var response = new List<PostResponse>();
            foreach (var post in posts)
            {
                var postItem = ApplicationMapper.MapToPost(post);
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await unitOfWork.PostRepository.CountSharesByPostIdAsync(post.Id);
                    postItem.Shares = shares;
                };

                response.Add(postItem);

            }

            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<PostResponse>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = hasMore,
                },
                IsSuccess = true,
                Message = "Lấy danh sách bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
