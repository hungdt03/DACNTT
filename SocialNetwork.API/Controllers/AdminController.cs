using CloudinaryDotNet.Actions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Features.Post.Commands;

namespace SocialNetwork.API.Controllers
{
    [Authorize(Roles = "ADMIN")]
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
        [HttpGet("count-all-user")]
        public async Task<IActionResult> CountAllUser()
        {
            var response = await mediator.Send(new CountAllUserQuery());
            return Ok(response);
        }
        [HttpGet("count-all-user-islock")]
        public async Task<IActionResult> CountAllUserIsLock()
        {
            var response = await mediator.Send(new CountAllUserIsLockQuery());
            return Ok(response);
        }
        [HttpGet("get-all-user-connection")]
        public async Task<IActionResult> GetAllConnections() {
            var response = await mediator.Send(new GetAllUserConnectionQuery());
            return Ok(response);
        }
        [HttpGet("get-top-10-user-score")]
        public async Task<IActionResult> GetTop10UserScore()
        {
            var response = await mediator.Send(new GetTop10UserActiveQuery());
            return Ok(response);
        }
        [HttpGet("get-year")]
        public async Task<IActionResult> GetYear()
        {
            var response = await mediator.Send(new GetRegistrationYearsQuery());
            return Ok(response);
        }
        [HttpGet("get-registration-stats-by-year/{year}")]
        public async Task<IActionResult> GetRegistrationStatsByYear([FromRoute] int year)
        {
            var response = await mediator.Send(new GetRegistrationStatsByYearsQuery(year));
            return Ok(response);
        }
        // POST
        [HttpGet("count-all-post")]
        public async Task<IActionResult> CountAllPost()
        {
            var response = await mediator.Send(new CountAllPostQuery());
            return Ok(response);
        }
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
        [HttpGet("count-all-group")]
        public async Task<IActionResult> CountAllGroup()
        {
            var response = await mediator.Send(new CountAllGroupQuery());
            return Ok(response);
        }
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
        [HttpGet("count-all-report")]
        public async Task<IActionResult> CountAllReport()
        {
            var response = await mediator.Send(new CountAllReportQuery());
            return Ok(response);
        }
        [HttpPut("update-report")]
        public async Task<IActionResult> UpdateReport([FromBody] UpdateReportCommand command)
        {
            var response = await mediator.Send(command);
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
        [AllowAnonymous]
        [HttpGet("get-report-by-id/{reportId}")]
        public async Task<IActionResult> GetReportById([FromRoute] Guid reportId)
        {
            var response = await mediator.Send(new GetReportByIdQuery(reportId));
            return Ok(response);
        }
    }
}
