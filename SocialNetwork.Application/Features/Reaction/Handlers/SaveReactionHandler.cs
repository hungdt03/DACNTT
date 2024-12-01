
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Reaction.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Reaction.Handlers
{
    public class SaveReactionHandler : IRequestHandler<SaveReactionCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public SaveReactionHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(SaveReactionCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Bài viết không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var findReaction = await _unitOfWork.ReactionRepository.GetReactionByPostIdAndUserIdAsync(request.PostId, userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (findReaction != null)
            {
                if(findReaction.Type == request.ReactionType)
                {
                    _unitOfWork.ReactionRepository.RemoveReaction(findReaction);
                } else
                {
                    findReaction.Type = request.ReactionType;
                }
            } else
            {
                var reaction = new Domain.Entity.Reaction()
                {
                    PostId = request.PostId,
                    Type = request.ReactionType,
                    UserId = userId,
                };

                await _unitOfWork.ReactionRepository.CreateReactionAsync(reaction);
            }
            
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bày tỏ cảm xúc bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
