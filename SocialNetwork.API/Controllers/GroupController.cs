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
    }
}
