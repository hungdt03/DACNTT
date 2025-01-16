using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.ChatRoom.Commands;
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

        [HttpPost]
        public async Task<IActionResult> CreateChatRoom([FromBody] CreateChatRoomCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllChatRooms()
        {
            var response = await mediator.Send(new GetAllChatRoomsQuery());
            return Ok(response);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchChatRoomsByName([FromQuery] string name = "")
        {
            var response = await mediator.Send(new SearchChatRoomByNameQuery(name));
            return Ok(response);
        }

        [HttpGet("medias/{chatRoomId}")]
        public async Task<IActionResult> GetAllMediasByChatRoomId([FromRoute] Guid chatRoomId, [FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var response = await mediator.Send(new GetMediasByChatRoomIdQuery(chatRoomId, page, size));
            return Ok(response);
        }

        [HttpGet("{chatRoomId}")]
        public async Task<IActionResult> GetChatRoomById([FromRoute] Guid chatRoomId)
        {
            var response = await mediator.Send(new GetChatRoomByIdQuery(chatRoomId));
            return Ok(response);
        }
    }
}
