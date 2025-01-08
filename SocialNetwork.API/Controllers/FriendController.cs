using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Features.Friend.Commands;
using SocialNetwork.Application.Features.Friend.Queries;

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

        [HttpGet("top-six/{userId}")]
        public async Task<IActionResult> GetTopSixOfUserFriends([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetTopSixMutualFriendsQuery(userId));
            return Ok(response);    
        }

        [HttpDelete("{friendId}")]
        public async Task<IActionResult> DeleteFriend([FromRoute] string friendId)
        {
            var response = await mediator.Send(new DeleteFriendCommand(friendId));
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFriends()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetAllFriendsQuery(userId));
            return Ok(response);
        }

        [HttpGet("fullName")]
        public async Task<IActionResult> GetAllFriendsByFullName([FromQuery] string fullName)
        {
            var response = await mediator.Send(new GetAllFriendsByFullNameQuery(fullName));
            return Ok(response);
        }
    }
}
