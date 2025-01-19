using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Follow.Commands;
using SocialNetwork.Application.Features.Follow.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/follows")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FollowController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("followers/{userId}")]
        public async Task<IActionResult> GetAllFollowersByUserId([FromRoute] string userId)
        {
            var response = await _mediator.Send(new GetAllFollowerByUserIdQuery(userId));
            return Ok(response);
        }

        [HttpGet("followees/{userId}")]
        public async Task<IActionResult> GetAllFolloweesByUserId([FromRoute] string userId)
        {
            var response = await _mediator.Send(new GetAllFolloweesByUserIdQuery(userId));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> FollowUser([FromBody] CreateFollowCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("unfollow/{followeeId}")]
        public async Task<IActionResult> UnfollowUser([FromRoute] string followeeId)
        {
            var response = await _mediator.Send(new UnfollowUserCommand(followeeId));
            return Ok(response);
        }

        [HttpGet("check/{followeeId}")]
        public async Task<IActionResult> CheckFollowUser([FromRoute] string followeeId)
        {
            var response = await _mediator.Send(new CheckFollowUserQuery(followeeId));
            return Ok(response);
        }
    }
}
