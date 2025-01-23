
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Comment.Commands
{
    public class DeleteCommentCommand : IRequest<BaseResponse>
    {
        public Guid CommentId { get; set; }

        public DeleteCommentCommand(Guid commentId)
        {
            CommentId = commentId;
        }
    }
}
