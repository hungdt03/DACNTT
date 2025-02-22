using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Report.Commands;
using SocialNetwork.Application.Features.Report.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReportController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("user")]
        public async Task<IActionResult> ReportUser([FromBody] ReportUserCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("comment")]
        public async Task<IActionResult> ReportComment([FromBody] ReportCommentCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("post")]
        public async Task<IActionResult> ReportPost([FromBody] ReportPostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }


        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("group")]
        public async Task<IActionResult> ReportGroup([FromBody] ReportGroupCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("groups/pending/{groupId}")]
        public async Task<IActionResult> GetAllPendingReportsByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllPendingReportsByGroupIdQuery(groupId, page, size));
            return Ok(response);
        }

        [HttpPut("group/comment/{reportId}")]
        public async Task<IActionResult> RemoveCommentByGroupAdmin([FromRoute] Guid reportId)
        {
            var response = await _mediator.Send(new RemoveCommentByGroupAdminCommand(reportId));
            return Ok(response);
        }

        [HttpPut("group/post/{reportId}")]
        public async Task<IActionResult> RemovePostByGroupAdmin([FromRoute] Guid reportId)
        {
            var response = await _mediator.Send(new RemovePostByGroupAdminCommand(reportId));
            return Ok(response);
        }

        [HttpPut("group/member/{reportId}")]
        public async Task<IActionResult> RemoveMemberByGroupAdmin([FromRoute] Guid reportId)
        {
            var response = await _mediator.Send(new RemoveMemberByGroupAdminCommand(reportId));
            return Ok(response);
        }

        [HttpPut("group/{reportId}")]
        public async Task<IActionResult> RemoveGroupReportById([FromRoute] Guid reportId)
        {
            var response = await _mediator.Send(new RemoveGroupReportCommand(reportId));
            return Ok(response);
        }
    }
}
