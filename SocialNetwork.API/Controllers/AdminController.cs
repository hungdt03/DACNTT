using CloudinaryDotNet;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Handlers;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Features.Post.Queries;

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
        public async Task<IActionResult> GetAllUser([FromQuery] int page = 1, [FromQuery] int size = 6, [FromQuery] string search = "")
        {
            var response = await mediator.Send(new GetAllUserQuery(page, size, search));
            return Ok(response);
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserById([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetUserByIdQuery(userId));
            return Ok(response);
        }

        [HttpGet("users/followers/{userId}")]
        public async Task<IActionResult> GetAllFollowersByUserId([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string search = "")
        {
            var response = await mediator.Send(new GetAllFollowersByUserIdQuery(userId, page, size, search));
            return Ok(response);
        }


        [HttpGet("users/followees/{userId}")]
        public async Task<IActionResult> GetAllFolloweesByUserId([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string search = "")
        {
            var response = await mediator.Send(new GetAllFolloweesByUserIdQuery(userId, page, size, search));
            return Ok(response);
        }

        [HttpGet("users/friends/{userId}")]
        public async Task<IActionResult> GetAllFriendsByUserId([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string search = "")
        {
            var response = await mediator.Send(new GetAllFriendsByUserIdQuery(userId, page, size, search));
            return Ok(response);
        }

        [HttpGet("users/posts/{userId}")]
        public async Task<IActionResult> GetPostsByUserId([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string search = "", [FromQuery] string sortOrder = "desc", [FromQuery] string contentType = "ALL", [FromQuery] DateTimeOffset? fromDate = default, [FromQuery] DateTimeOffset? toDate = default)
        {
            if (fromDate == default)
            {
                fromDate = null;
            }

            if (toDate == default)
            {
                toDate = null;
            }

            var response = await mediator.Send(new Application.Features.Admin.Queries.GetAllPostByUserIdQuery(userId, page, size,  contentType, sortOrder, search, fromDate, toDate));
            return Ok(response);
        }

        [HttpGet("get-all-post")]
        public async Task<IActionResult> GetALlPosts([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string search = "", [FromQuery] string sortOrder = "desc", [FromQuery] string contentType = "ALL", [FromQuery] DateTimeOffset? fromDate = default, [FromQuery] DateTimeOffset? toDate = default)
        {
            if (fromDate == default)
            {
                fromDate = null;
            }

            if (toDate == default)
            {
                toDate = null;
            }

            var response = await mediator.Send(new Application.Features.Admin.Queries.GetAllPostQuery(page, size, search, sortOrder, contentType, fromDate, toDate));
            return Ok(response);
        }

        [HttpGet("get-all-group")]
        public async Task<IActionResult> GetAllGroup([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string search = "", [FromQuery] string privacy = "ALL")
        {
            var response = await mediator.Send(new GetAllGroupQuery(page, size, search, privacy));
            return Ok(response);
        }

        [HttpGet("groups/{groupId}")]
        public async Task<IActionResult> GetGroupById([FromRoute] Guid groupId)
        {
            var response = await mediator.Send(new GetGroupByIdQuery(groupId));
            return Ok(response);
        }

        [HttpGet("groups/posts/{groupId}")]
        public async Task<IActionResult> GetAllPostsByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 6, [FromQuery] string search = "", [FromQuery] string authorId = "", [FromQuery] string sortOrder = "desc", [FromQuery] string contentType = "all", [FromQuery] DateTimeOffset? fromDate = default, [FromQuery] DateTimeOffset? toDate = default)
        {

            if (fromDate == default)
            {
                fromDate = null;
            }

            if (toDate == default)
            {
                toDate = null;
            }

            var response = await mediator.Send(new Application.Features.Admin.Queries.GetAllPostByGroupIdQuery(groupId , page, size, search, authorId, sortOrder, contentType, fromDate, toDate));
            return Ok(response);
        }

        [HttpGet("groups/members/{groupId}")]
        public async Task<IActionResult> GetAllMembersByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 6, [FromQuery] string search = "", [FromQuery] string role = "ALL")
        {
            var response = await mediator.Send(new GetAllMembersByGroupIdQuery(groupId, page, size, search, role));
            return Ok(response);
        }

        [HttpGet("get-all-report")]
        public async Task<IActionResult> GetAllReport([FromQuery] int page, [FromQuery] int size, [FromQuery] string status = "ALL", [FromQuery] string type = "ALL")
        {
            var response = await mediator.Send(new GetAllReportQuery(page, size, status, type));
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
        [HttpGet("get-top1-followers")]
        public async Task<IActionResult> GetTop1Followers()
        {
            var response = await mediator.Send(new GetTop1FollowersQuery());
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
        //COMMENT
        [HttpDelete("delete-comment")]
        public async Task<IActionResult> DeleteOneComment([FromBody] List<string> listReportId)
        {
            var response = await mediator.Send(new DeleteManyReportQuery(listReportId));
            return Ok(response);
        }
    }
}
