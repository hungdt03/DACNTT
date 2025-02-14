using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Features.Post.Commands;

namespace SocialNetwork.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IMediator mediator;
        public AdminController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpGet("get-all-user")]
        public async Task<IActionResult> GetAllUser()
        {
            var response = await mediator.Send(new GetAllUserQuery());
            return Ok(response);
        }

        [HttpGet("get-all-post")]
        public async Task<IActionResult> GetALlPosts()
        {
            var response = await mediator.Send(new GetAllPostQuery());
            return Ok(response);
        }

        [HttpGet("get-all-group")]
        public async Task<IActionResult> GetAllGroup()
        {
            var response = await mediator.Send(new GetAllGroupQuery());
            return Ok(response);
        }
        [HttpGet("get-all-report")]
        public async Task<IActionResult> GetAllReport()
        {
            var response = await mediator.Send(new GetAllReportQuery());
            return Ok(response);
        }
        // USER
        [HttpPut("lock-users")]
        public async Task<IActionResult> LockAccount([FromBody] UnlockAndLockManyAccountCommand command)
        {
            var response = await mediator.Send(new UnLockAndLockManyAccountQuery(command.listUserId, command.number));
            return Ok(response);
        }
        [HttpPut("lock-users/{userId}")]
        public async Task<IActionResult> UnLockAccount(string userId)
        {
            var response = await mediator.Send(new UnLockAndLockOneAccountQuery(userId));
            return Ok(response);
        }
        
        [HttpDelete("delete-user/{userId}")]
        public async Task<IActionResult> DeleteOneAccount(string userId)
        {
            var response = await mediator.Send(new DeleteUserQuery(userId));
            return Ok(response);
        }
        [HttpDelete("delete-all-user")]
        public async Task<IActionResult> DeleteAllAccount()
        {
            var response = await mediator.Send(new DeleteAllUserQuery());
            return Ok(response);
        }
        [HttpDelete("delete-many-user")]
        public async Task<IActionResult> DeleteManyAccount([FromBody] List<string>listUserId)
        {
            var response = await mediator.Send(new DeleteManyUserQuery(listUserId));
            return Ok(response);
        }
        // POST
        [HttpDelete("delete-post/{postId}")]
        public async Task<IActionResult> DeleteOnePost([FromRoute] Guid postId)
        {
            var response = await mediator.Send(new DeletePostCommand(postId));
            return Ok(response);
        }
        [HttpDelete("delete-all-post")]
        public async Task<IActionResult> DeleteAllPost()
        {
            var response = await mediator.Send(new DeleteAllPostQuery());
            return Ok(response);
        }
        [HttpDelete("delete-many-post")]
        public async Task<IActionResult> DeleteManyPost([FromBody] List<string> listPostId)
        {
            var response = await mediator.Send(new DeleteManyPostQuery(listPostId));
            return Ok(response);
        }
        // GROUP
        [HttpDelete("delete-group/{groupId}")]
        public async Task<IActionResult> DeleteOneGroup([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new DeleteOneGroupQuery(groupId));
            return Ok(response);
        }
        [HttpDelete("delete-all-group")]
        public async Task<IActionResult> DeleteAllGroup()
        {
            var response = await mediator.Send(new DeleteAllGroupQuery());
            return Ok(response);
        }
        [HttpDelete("delete-many-group")]
        public async Task<IActionResult> DeleteManyGroup([FromBody] List<string> listPostId)
        {
            var response = await mediator.Send(new DeleteManyGroupQuery(listPostId));
            return Ok(response);
        }
        // REPORT
        [HttpDelete("update-report/{reportId}")]
        public async Task<IActionResult> UpdateOneReport([FromRoute] Guid reportId, [FromBody] string newStatus)
        {
            var response = await mediator.Send(new UpdateReportCommand(reportId, newStatus));
            return Ok(response);
        }
        [HttpDelete("delete-report/{reportId}")]
        public async Task<IActionResult> DeleteOneReport([FromRoute] Guid reportId)
        {
            var response = await mediator.Send(new DeleteOneReportQuery(reportId));
            return Ok(response);
        }
        [HttpDelete("delete-all-report")]
        public async Task<IActionResult> DeleteAllReport()
        {
            var response = await mediator.Send(new DeleteAllReportQuery());
            return Ok(response);
        }
        [HttpDelete("delete-many-report")]
        public async Task<IActionResult> DeleteManyReport([FromBody] List<string> listReportId)
        {
            var response = await mediator.Send(new DeleteManyReportQuery(listReportId));
            return Ok(response);
        }
    }
}
