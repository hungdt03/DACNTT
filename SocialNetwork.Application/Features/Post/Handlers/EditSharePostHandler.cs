

using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class EditSharePostHandler : IRequestHandler<EditSharePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public EditSharePostHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(EditSharePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết chia sẻ");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (request.Post.RemoveTagIds != null && request.Post.RemoveTagIds.Count > 0)
            {
                foreach (var item in post.Tags)
                {
                    if (request.Post.RemoveTagIds.Contains(item.Id))
                    {
                        var tag = await _unitOfWork.TagRepository.GetTagByIdAsync(item.Id);
                        if (tag == null) continue;

                        _unitOfWork.TagRepository.DeleteTag(tag);
                    }
                }
            }

            var tags = new List<Tag>();
            if (request.Post.TagIds != null && request.Post.TagIds.Count > 0)
            {
                foreach (var tag in request.Post.TagIds)
                {
                    if (post.Tags.Any(t => t.UserId == tag)) continue;

                    var tagUser = await _unitOfWork.UserRepository.GetUserByIdAsync(tag)
                        ?? throw new NotFoundException("Không tìm thấy thẻ user");

                    tags.Add(new Tag()
                    {
                        UserId = tagUser.Id,
                    });
                }

            }

            post.Content = request.Post.Content;
            post.Privacy = request.Post.Privacy;
            post.Tags = (post.Tags ?? new List<Tag>()).Concat(tags).ToList();

            
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
