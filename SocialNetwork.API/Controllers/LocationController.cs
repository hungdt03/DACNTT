using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Location.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly IMediator mediator;

        public LocationController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SearchLocationsContainsName([FromQuery] string name)
        {
            var response = await mediator.Send(new SearchLocationsContainsNameQuery(name));
            return Ok(response);
        }
    }
}
