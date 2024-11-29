
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class CreatePostHandler : IRequestHandler<CreatePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreatePostHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var post = new SocialNetwork.Domain.Entity.Post
            {
                RawContent = request.Content,
                HtmlContent = request.Title,
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.PostRepository.CreatePostAsync(post);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new DataResponse<SocialNetwork.Domain.Entity.Post>
            {
                IsSuccess = true,
                Message = "Create post successfully",
                Data = post,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
