using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Reaction.Commands;
using SocialNetwork.Application.Features.Reaction.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/reactions")]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private readonly IMediator mediator;

        public ReactionController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> SaveReaction([FromRoute] Guid postId)
        {
            var response = await mediator.Send(new GetAllReactionsByPostIdQuery(postId));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SaveReaction([FromBody] SaveReactionCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
