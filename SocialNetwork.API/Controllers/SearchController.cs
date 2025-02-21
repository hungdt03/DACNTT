using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Search.Commands;
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
        public async Task<IActionResult> SearchGroups([FromQuery] int page = 1, [FromQuery] int size = 6, [FromQuery] string query = "", [FromQuery] string sortOrder = "desc", [FromQuery] string contentType = "all", [FromQuery] DateTimeOffset? fromDate = default, [FromQuery] DateTimeOffset? toDate = default)
        {
            if (fromDate == default)
            {
                fromDate = null;
            }

            if (toDate == default)
            {
                toDate = null;
            }

            var response = await _mediator.Send(new SearchPostQuery(query, page, size, sortOrder, contentType, fromDate, toDate));
            return Ok(response);
        }

        [HttpGet("users")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await _mediator.Send(new SearchUserQuery(query, page, size));
            return Ok(response);
        }

        [HttpGet("histories")]
        public async Task<IActionResult> GetAllSearchHistories([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var response = await _mediator.Send(new GetUserSearchHistoriesQuery(page, size));
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("histories/group")]
        public async Task<IActionResult> AddSearchGroup([FromBody] AddSearchGroupCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("histories/text")]
        public async Task<IActionResult> AddSearchTextPlain([FromBody] AddSearchTextPlainCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("histories/user")]
        public async Task<IActionResult> AddSearchUser([FromBody] AddSearchUserCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpDelete("histories/{historyId}")]
        public async Task<IActionResult> RemoveSearchHistory([FromRoute] Guid historyId)
        {
            var response = await _mediator.Send(new RemoveSearchHistoryCommand(historyId));
            return Ok(response);
        }

        [HttpDelete("histories")]
        public async Task<IActionResult> RemoveAlSearchHistories()
        {
            var response = await _mediator.Send(new RemoveAllSearchHistoryCommand());
            return Ok(response);
        }
    }
}
