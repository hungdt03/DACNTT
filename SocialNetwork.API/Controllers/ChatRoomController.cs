using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.ChatRoom.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/chatRooms")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private readonly IMediator mediator;

        public ChatRoomController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllChatRooms()
        {
            var response = await mediator.Send(new GetAllChatRoomsQuery());
            return Ok(response);
        }
    }
}
