using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.ChatRoom.Commands;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Features.Group.Commands;

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

        [HttpGet("pending")]
        public async Task<IActionResult> GetAllPendingChatRooms()
        {
            var response = await mediator.Send(new GetAllPendingChatRoomQuery());
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

        [HttpPost("get-or-create")]
        public async Task<IActionResult> GetOrCreateChatRoom([FromBody] GetOrCreatePrivateChatCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPut("update-name")]
        public async Task<IActionResult> ChangeRoomName([FromBody] ChangeRoomNameCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);    
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadChatRoomImage([FromForm] UploadAvatarChatRoomCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("members/add")]
        public async Task<IActionResult> AddMemberToRoom([FromBody] AddMembersToChatRoomCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("members/kick/{memberId}")]
        public async Task<IActionResult> KichMemberOutGroup([FromRoute] Guid memberId)
        {
            var response = await mediator.Send(new KickMemberInChatRoomCommand(memberId));
            return Ok(response);
        }

        [HttpPut("members/add-leader/{memberId}")]
        public async Task<IActionResult> AddLeaderInChatRoom([FromRoute] Guid memberId)
        {
            var response = await mediator.Send(new ChooseNewLeaderInChatRoomCommand(memberId));
            return Ok(response);
        }

        [HttpPut("members/leave/{chatRoomId}")]
        public async Task<IActionResult> LeaveGroup([FromRoute] Guid chatRoomId)
        {
            var response = await mediator.Send(new LeaveChatRoomCommand(chatRoomId));
            return Ok(response);
        }

        [HttpGet("members/{chatRoomId}")]
        public async Task<IActionResult> GetAllMembersInChatRoom([FromRoute] Guid chatRoomId)
        {
            var response = await mediator.Send(new GetAllMembersInChatRoomQuery(chatRoomId));
            return Ok(response);
        }

    }
}
