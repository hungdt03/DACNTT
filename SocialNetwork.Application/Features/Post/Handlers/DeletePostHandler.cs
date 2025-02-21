
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class DeletePostHandler : IRequestHandler<DeletePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeletePostHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(DeletePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Không tìm thấy bài viết");

            var reactions = await _unitOfWork.ReactionRepository.GetAllReactionsByPostIdAsync(request.PostId);
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAsync(request.PostId);
            var sharePosts = await _unitOfWork.PostRepository.GetAllSharePostsByOriginalPostId(request.PostId);
            var tags = await _unitOfWork.TagRepository.GetAllTagsByPostIdAsync(post.Id);
            
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            _unitOfWork.ReactionRepository.RemoveRange(reactions);

            sharePosts.ForEach(p =>
            {
                if(post.PostType == PostType.ORIGINAL_POST)
                {
                    if (p.SharePostId == p.OriginalPostId)
                    {
                        p.SharePostId = null;
                    }

                    p.OriginalPostId = null;
                } else
                {
                    p.SharePostId = null;
                }
                
            });

            _unitOfWork.CommentRepository.RemoveRange(comments);
            _unitOfWork.TagRepository.RemoveRange(tags);
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
