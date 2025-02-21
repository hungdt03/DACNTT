using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class DeletePostHandler : IRequestHandler<DeletePostCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;

        public DeletePostHandler(ISignalRService signalRService, IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(DeletePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Không tìm thấy bài viết");

            var reactions = await _unitOfWork.ReactionRepository.GetAllReactionsByPostIdAsync(request.PostId);
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAsync(request.PostId);
            var sharePosts = await _unitOfWork.PostRepository.GetAllSharePostsByOriginalPostId(request.PostId);
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.ReactionRepository.RemoveRange(reactions);
            _unitOfWork.CommentRepository.RemoveRange(comments);
            UpdateSharedPosts(sharePosts, post);
            _unitOfWork.PostRepository.DeletePost(post);

            if (_contextAccessor.HttpContext.User.GetUserRole() == "ADMIN")
            {
                await NotifyUser(post);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new DataResponse<PostResponse>()
            {
                Data = ApplicationMapper.MapToPost(post),
                IsSuccess = true,
                Message = "Xóa bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        private void UpdateSharedPosts(IEnumerable<Domain.Entity.PostInfo.Post> sharePosts, Domain.Entity.PostInfo.Post post)
        {
            foreach (var p in sharePosts)
            {
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    p.SharePostId = (p.SharePostId == p.OriginalPostId) ? null : p.SharePostId;
                    p.OriginalPostId = null;
                }
                else
                {
                    p.SharePostId = null;
                }

            });

            _unitOfWork.CommentRepository.RemoveRange(comments);
            _unitOfWork.PostRepository.DeletePost(post);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
