using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Major.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/majors")]
    [ApiController]
    public class MajorController : ControllerBase
    {
        private readonly IMediator mediator;

        public MajorController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SearchMajorsContainsName([FromQuery] string name)
        {
            var response = await mediator.Send(new SearchMajorContainsNameQuery(name));
            return Ok(response);
        }
    }
}
