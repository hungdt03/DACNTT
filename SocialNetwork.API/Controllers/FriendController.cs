using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Friend.Commands;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/friends")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly IMediator mediator;

        public FriendController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpDelete("{friendId}")]
        public async Task<IActionResult> DeleteFriend([FromRoute] string friendId)
        {
            var response = await mediator.Send(new DeleteFriendCommand(friendId));
            return Ok(response);
        }
    }
}
