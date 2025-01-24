using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.School.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/schools")]
    [ApiController]
    public class SchoolController : ControllerBase
    {
        private readonly IMediator mediator;

        public SchoolController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SearchSchoolsContainsName([FromQuery] string name)
        {
            var response = await mediator.Send(new SearchSchoolsContainsNameQuery(name));
            return Ok(response);
        }
    }
}
