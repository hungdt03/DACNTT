using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Features.Auth.Commands;

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
    }
}
