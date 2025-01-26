using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Position.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/positions")]
    [ApiController]
    public class PositionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PositionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SearchPositions([FromQuery] string name)
        {
            var response = await _mediator.Send(new SearchPositionsContainsNameQuery(name));
            return Ok(response);
        }
    }
}
