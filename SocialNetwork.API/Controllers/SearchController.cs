using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Search.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SearchController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SearchAll([FromQuery] string query)
        {
            var response = await _mediator.Send(new SearchAllQuery(query));
            return Ok(response);
        }

        [HttpGet("groups")]
        public async Task<IActionResult> SearchPosts([FromQuery] string query)
        {
            var response = await _mediator.Send(new SearchPostQuery(query));
            return Ok(response);
        }

        [HttpGet("posts")]
        public async Task<IActionResult> SearchGroups([FromQuery] string query)
        {
            var response = await _mediator.Send(new SearchGroupQuery(query));
            return Ok(response);
        }

        [HttpGet("users")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            var response = await _mediator.Send(new SearchUserQuery(query));
            return Ok(response);
        }
    }
}
