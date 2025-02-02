using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Search.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/search")]
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

        [HttpGet("suggest")]
        public async Task<IActionResult> SearchAllMention([FromQuery] string query)
        {
            var response = await _mediator.Send(new GetAllSearchSuggestQuery(query));
            return Ok(response);
        }

        [HttpGet("groups")]
        public async Task<IActionResult> SearchPosts([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await _mediator.Send(new SearchGroupQuery(query, page, size));
            return Ok(response);
        }

        [HttpGet("posts")]
        public async Task<IActionResult> SearchGroups([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await _mediator.Send(new SearchPostQuery(query, page, size));
            return Ok(response);
        }

        [HttpGet("users")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await _mediator.Send(new SearchUserQuery(query, page, size));
            return Ok(response);
        }
    }
}
