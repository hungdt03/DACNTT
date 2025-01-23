using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
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

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("share")]
        public async Task<IActionResult> SharePost([FromBody] CreateSharePostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPut("share/{postId}")]
        public async Task<IActionResult> EditSharePost([FromRoute] Guid postId, [FromBody] EditSharePostRequest request)
        {
            var response = await _mediator.Send(new EditSharePostCommand(postId, request));
            return Ok(response);
        }

        [HttpGet("share/{postId}")]
        public async Task<IActionResult> GetAllSharesByPostId([FromRoute] Guid postId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllSharesByPostIdQuery(postId, page, size));
            return Ok(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllPosts([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllPostQuery(page, size));
            return Ok(response);
        }

        [HttpGet("principal")]
        public async Task<IActionResult> GetAllPostsByPrincipal([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var userId = HttpContext.User.GetUserId();
            var response = await _mediator.Send(new GetAllPostByUserIdQuery(userId, page, size));
            return Ok(response);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllPostsByPrincipal([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllPostByUserIdQuery(userId, page, size));
            return Ok(response);
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPostById([FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new GetPostByIdQuery(postId));
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPut("{postId}")]
        public async Task<IActionResult> EditPost([FromRoute] Guid postId, [FromForm] EditPostRequest post)
        {
            var response = await _mediator.Send(new EditPostCommand(postId, post));
            return Ok(response);
        }

        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePost([FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new DeletePostCommand(postId));
            return Ok(response);
        }
    }
}
