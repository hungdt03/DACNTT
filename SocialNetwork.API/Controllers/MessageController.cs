﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Message.Commands;
using SocialNetwork.Application.Features.Message.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMediator mediator;

        public MessageController(IMediator mediator)
        {
            this.mediator = mediator;
        }


        [HttpGet("{chatRoomId}")]
        public async Task<IActionResult> GetAllMessagesByChatRoomId([FromRoute] Guid chatRoomId)
        {
            var response = await mediator.Send(new GetAllMessagesByChatRoomQuery(chatRoomId));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SendNewMessage([FromForm] CreateMessageCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
