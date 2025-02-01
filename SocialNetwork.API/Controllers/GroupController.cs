using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Features.Group.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/groups")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly IMediator mediator;

        public GroupController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromForm] CreateGroupCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("{groupId}")]
        public async Task<IActionResult> GetGroupById([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new GetGroupByIdQuery(groupId));
            return Ok(response);
        }

        [HttpGet("manage")]
        public async Task<IActionResult> GetAllGroupsManageByCurrentUser()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetAllGroupsManagerByUserIdQuery(userId));
            return Ok(response);
        }


        [HttpGet("join")]
        public async Task<IActionResult> GetAllGroupsJoinByCurrentUser()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetAllGroupsJoinByUserIdQuery(userId));
            return Ok(response);
        }

        [HttpPost("join/{groupId}")]
        public async Task<IActionResult> RequestJoinGroup([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new CreateJoinGroupRequestCommand(groupId));
            return Ok(response);
        }

        [HttpPost("approval/{requestId}")]
        public async Task<IActionResult> ApprovalRequestJoinGroup([FromRoute] Guid requestId)
        {
            var response = await mediator.Send(new ApprovalJoinGroupRequestCommand(requestId));
            return Ok(response);
        }

        [HttpGet("approval-summary/{groupId}")]
        public async Task<IActionResult> GetGroupApprovalSummary([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new GetPendingApprovalsSummaryQuery(groupId));
            return Ok(response);
        }

        [HttpPost("invite-friends")]
        public async Task<IActionResult> InviteFriendsJoinGroup([FromBody] InviteFriendsCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("invite-friends/accept/{inviteId}")]
        public async Task<IActionResult> AcceptInviteFriend([FromRoute] Guid inviteId)
        {
            var response = await mediator.Send(new AcceptInviteFriendCommand(inviteId));
            return Ok(response);
        }

        [HttpPut("invite-friends/cancel/{inviteId}")]
        public async Task<IActionResult> CancelInviteFriend([FromRoute] Guid inviteId)
        {
            var response = await mediator.Send(new CancelInviteFriendCommand(inviteId));
            return Ok(response);
        }

        [HttpPut("invite-friends/reject/{inviteId}")]
        public async Task<IActionResult> RejectInviteFriend([FromRoute] Guid inviteId)
        {
            var response = await mediator.Send(new RejectInviteFriendCommand(inviteId));
            return Ok(response);
        }
    }
}
