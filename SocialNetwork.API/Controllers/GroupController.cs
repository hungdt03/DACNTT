using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
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


        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPut("{groupId}")]
        public async Task<IActionResult> UpdateGeneralInfo([FromRoute] Guid groupId, [FromBody] UpdateGroupRequest group)
        {
            var response = await mediator.Send(new UpdateGeneralInfoCommand(groupId, group));
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

        [HttpGet("join/{groupId}")]
        public async Task<IActionResult> GetJoinGroupRequestByGroupIdAndCurrentUser([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new GetJoinGroupRequestByGroupIdQuery(groupId));
            return Ok(response);
        }

        [HttpGet("pending-requests/{groupId}")]
        public async Task<IActionResult> GetAllPendingJoinRequestesByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllJoinGroupRequestByGroupIdQuery(groupId, page, size));
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

        [HttpPut("cancel/{requestId}")]
        public async Task<IActionResult> CancelRequestJoinGroup([FromRoute] Guid requestId)
        {
            var response = await mediator.Send(new CancelJoinGroupRequestCommand(requestId));
            return Ok(response);
        }

        [HttpPut("reject/{requestId}")]
        public async Task<IActionResult> RejectRequestJoinGroup([FromRoute] Guid requestId)
        {
            var response = await mediator.Send(new RejectJoinGroupRequestCommand(requestId));
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


        [HttpGet("members/{groupId}")]
        public async Task<IActionResult> GetMembersByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllMembersByGroupIdQuery(groupId, page, size));
            return Ok(response);
        }

        [HttpGet("members-non-admins/{groupId}")]
        public async Task<IActionResult> GetAllNonAdminsMembersByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllNonAdminMembersByGroupIdQuery(groupId, page, size));
            return Ok(response);
        }


        [HttpDelete("kick/{memberId}")]
        public async Task<IActionResult> KickGroupMember([FromRoute] Guid memberId)
        {
            var response = await mediator.Send(new KickGroupMemberCommand(memberId));
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("leave-group")]
        public async Task<IActionResult> LeaveGroup([FromBody] LeaveGroupCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("revoke-permission/{memberId}")]
        public async Task<IActionResult> RevokeMemberPermission([FromRoute] Guid memberId)
        {
            var response = await mediator.Send(new RevokeUserPermissionCommand(memberId));
            return Ok(response);
        }

    }
}
