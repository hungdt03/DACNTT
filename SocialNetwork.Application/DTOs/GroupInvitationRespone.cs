using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.DTOs
{
    public class GroupInvitationRespone : IRequest<BaseResponse>
    {
        public Guid Id { get; set; }
        public bool Status { get; set; }
        public GroupResponse Group { get; set; }
        public UserResponse Inviter { get; set; }
        public UserResponse Invitee { get; set; }
        public DateTimeOffset DateCreated { get; set; }
    }
}
