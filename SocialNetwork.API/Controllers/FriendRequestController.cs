using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.FriendRequest.Commands;
using SocialNetwork.Application.Features.FriendRequest.Queries;
using SocialNetwork.Application.Features.FriendShip.Commands;
using SocialNetwork.Application.Features.FriendShip.Queries;
using SocialNetwork.Application.Features.User.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/friend-requests")]
    [ApiController]
    public class FriendRequestController : ControllerBase
    {
        private readonly IMediator mediator;

        public FriendRequestController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost]
        public async Task<IActionResult> CreateFriendRequest([FromBody] CreateFriendRequestCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("accepted/{requestId}")]
        public async Task<IActionResult> AcceptFriendRequest([FromRoute] Guid requestId)
        {
            var response = await mediator.Send(new AcceptFriendRequestCommand(requestId));
            return Ok(response);
        }

        [HttpPut("cancelled/{requestId}")]
        public async Task<IActionResult> CancelFriendRequest([FromRoute] Guid requestId)
        {
            var response = await mediator.Send(new CancelFriendRequestCommand(requestId));
            return Ok(response);
        }

        [HttpPut("cancelled/user/{userId}")]
        public async Task<IActionResult> CancelFriendRequestByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new CancelFriendRequestByUserIdCommand(userId));
            return Ok(response);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFriendRequestByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetFriendRequestByUserIdQuery(userId));
            return Ok(response);
        }
        [HttpGet("get-allrequest/{userId}")]
        public async Task<IActionResult> GetAllFriendRequestByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetAllFriendRequestByUserIdQuery(userId));
            return Ok(response);
        }
    }
}
