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

        [HttpGet("top-nine-user-friend/{userId}")]
        public async Task<IActionResult> GetTopNineOfUserFriends([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetTopNineOfUserFriendsQuery(userId));
            return Ok(response);    
        }

        [HttpGet("top-nine-my-friend")]
        public async Task<IActionResult> GetTopNineOfMyFriends()
        {
            var response = await mediator.Send(new GetTopNineOfMyFriendsQuery());
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

        [HttpGet("invitable/{groupId}")]
        public async Task<IActionResult> GetAllInvitableFriends([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new GetInvitableFriendsQuery(groupId));
            return Ok(response);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetAllFriendsByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetAllFriendsFullInfoQuery(userId));
            return Ok(response);
        }

        [HttpGet("fullName")]
        public async Task<IActionResult> GetAllFriendsByFullName([FromQuery] string fullName = "")
        {
            var response = await mediator.Send(new GetAllFriendsByFullNameQuery(fullName));
            return Ok(response);
        }
    }
}
