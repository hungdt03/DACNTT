using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Features.Post.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PostController(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var response = await _mediator.Send(new GetAllPostQuery());
            return Ok(response);
        }
    }
}
