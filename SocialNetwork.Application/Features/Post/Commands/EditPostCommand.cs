
using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Post.Commands
{
    public class EditPostCommand : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }
        public EditPostRequest Post { get; set; }

        public EditPostCommand(Guid postId, EditPostRequest post)
        {
            PostId = postId;
            Post = post;
        }
    }
}
