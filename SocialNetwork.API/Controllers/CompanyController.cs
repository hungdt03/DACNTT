using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Company.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/companies")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CompanyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> SearchCompanies([FromQuery] string name)
        {
            var response = await _mediator.Send(new SearchCompaniesContainsNameQuery(name));
            return Ok(response);
        }
    }
}
