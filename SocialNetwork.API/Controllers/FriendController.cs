using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Features.BlockList.Commands;
using SocialNetwork.Application.Features.Friend.Commands;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Features.FriendRequest.Queries;

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

        [HttpGet]
        public async Task<IActionResult> GetAllFriends([FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllMyFriendsFullInfoQuery(page, size));
            return Ok(response);
        }

        [HttpGet("connected-users")]
        public async Task<IActionResult> GetAllConnectedUsers([FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllConnectUsersQuery(page, size));
            return Ok(response);
        }


        [HttpGet("invitable/{groupId}")]
        public async Task<IActionResult> GetAllInvitableFriends([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new GetInvitableFriendsQuery(groupId));
            return Ok(response);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetAllFriendsByUserId([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllUserFriendsFullInfoQuery(userId, page, size));
            return Ok(response);
        }

        [HttpGet("fullName")]
        public async Task<IActionResult> GetAllFriendsByFullName([FromQuery] string fullName = "")
        {
            var response = await mediator.Send(new GetAllFriendsByFullNameQuery(fullName));
            return Ok(response);
        }

        [HttpGet("suggested")]
        public async Task<IActionResult> GetSuggestedFriends([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var response = await mediator.Send(new GetFriendSuggestionsQuery(page, size));
            return Ok(response);
        }
   
    }
}
