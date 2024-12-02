using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class EditSharePostCommand : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }
        public EditSharePostRequest Post { get; set; }

        public EditSharePostCommand(Guid postId, EditSharePostRequest post)
        {
            PostId = postId;
            Post = post;
        }
    }
}
