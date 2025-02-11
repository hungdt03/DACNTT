
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Reaction.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Reaction.Handlers
{
    public class SaveReactionHandler : IRequestHandler<SaveReactionCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public SaveReactionHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(SaveReactionCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Bài viết không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var findReaction = await _unitOfWork.ReactionRepository.GetReactionByPostIdAndUserIdAsync(request.PostId, userId);

            Domain.Entity.System.Notification notification = null;
            var countReactions = await _unitOfWork.ReactionRepository
                .CountReactionsByPostId(post.Id);

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
                var reaction = new Domain.Entity.PostInfo.Reaction()
                {
                    PostId = request.PostId,
                    Type = request.ReactionType,
                    UserId = userId,
                };

                var userFullname = _contextAccessor.HttpContext.User.GetFullName();
                var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();

                if (userId != post.UserId)
                {
                    var content = $"{userFullname} đã bày tỏ cảm xúc về bài viết của bạn";
                    if(countReactions > 0)
                    {
                        content = $"{userFullname} và {countReactions} người khác đã bày tỏ cảm xúc về bài viết của bạn";
                    }

                    notification = new Domain.Entity.System.Notification()
                    {
                        PostId = post.Id,
                        Type = NotificationType.POST_REACTION,
                        ImageUrl = userAvatar,
                        DateSent = DateTimeOffset.UtcNow,
                        IsRead = false,
                        Title = "Cảm xúc bài viết",
                        Content = content,
                        RecipientId = post.UserId,
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
                }
               
                await _unitOfWork.ReactionRepository.CreateReactionAsync(reaction);
            }

            if (notification != null)
            {
                await _signalRService.SendNotificationToSpecificUser(post.User.UserName, ApplicationMapper.MapToNotification(notification));
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
