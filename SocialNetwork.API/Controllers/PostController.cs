using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Features.Post.Handlers;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Features.SavedPost.Commands;
using SocialNetwork.Application.Features.SavedPost.Queries;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PostController(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPostById([FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new GetPostByIdQuery(postId));
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPut("{postId}")]
        public async Task<IActionResult> EditPost([FromRoute] Guid postId, [FromForm] EditPostRequest post)
        {
            var response = await _mediator.Send(new EditPostCommand(postId, post));
            return Ok(response);
        }

        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePost([FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new DeletePostCommand(postId));
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("change-privacy")]
        public async Task<IActionResult> ChangePostPrivacy([FromBody] ChangePostPrivacyCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }


        [HttpPut("revoke-tag/{postId}")]
        public async Task<IActionResult> RevokeTag([FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new RevokeTagByPostIdCommand(postId));
            return Ok(response);
        }

        // SAVED POSTS

        [HttpGet("saved-posts")]
        public async Task<IActionResult> GetAllSavedPosts([FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await _mediator.Send(new GetSavedPostsQuery(page, size));
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("saved-posts")]
        public async Task<IActionResult> AddSavedPost([FromBody] AddSavedPostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpDelete("saved-posts/{postId}")]
        public async Task<IActionResult> DeleteSavedPostByPostId([FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new RemoveSavedPostCommand(postId));
            return Ok(response);
        }

        // SHARE POSTS

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("share")]
        public async Task<IActionResult> SharePost([FromBody] CreateSharePostCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPut("share/{postId}")]
        public async Task<IActionResult> EditSharePost([FromRoute] Guid postId, [FromBody] EditSharePostRequest request)
        {
            var response = await _mediator.Send(new EditSharePostCommand(postId, request));
            return Ok(response);
        }

        [HttpGet("share/{postId}")]
        public async Task<IActionResult> GetAllSharesByPostId([FromRoute] Guid postId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllSharesByPostIdQuery(postId, page, size));
            return Ok(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllPosts([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllPostQuery(page, size));
            return Ok(response);
        }

        // GET POST FOR USER PAGE

        [HttpGet("principal")]
        public async Task<IActionResult> GetAllPostsByPrincipal([FromQuery] int page = 1, [FromQuery] int size = 8, [FromQuery] string search = "", [FromQuery] string sortOrder = "asc", [FromQuery] string contentType = "all", [FromQuery] DateTimeOffset fromDate = default, [FromQuery] DateTimeOffset toDate = default)
        {
            var userId = HttpContext.User.GetUserId();
            var response = await _mediator.Send(new GetAllPostByUserIdQuery(userId, page, size, search, sortOrder, contentType, fromDate, toDate));
            return Ok(response);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllPostsByUserId([FromRoute] string userId, [FromQuery] int page = 1, [FromQuery] int size = 8, [FromQuery] string search = "", [FromQuery] string sortOrder = "asc", [FromQuery] string contentType = "all", [FromQuery] DateTimeOffset fromDate = default, [FromQuery] DateTimeOffset toDate = default)
        {
            if (fromDate == default)
            {
                fromDate = DateTimeOffset.UtcNow;
            }

            if (toDate == default)
            {
                toDate = DateTimeOffset.UtcNow;
            }

            var response = await _mediator.Send(new GetAllPostByUserIdQuery(userId, page, size, contentType, sortOrder, search, fromDate, toDate));
            return Ok(response);
        }

        // POST GROUPS

        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetAllPostsByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllPostsByGroupIdQuery(groupId, page, size));
            return Ok(response);
        }

        [HttpGet("group")]
        public async Task<IActionResult> GetAllGroupPostsByCurrentUser([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllGroupPostsByCurrentUserQuery(page, size));
            return Ok(response);
        }

        [HttpGet("group/member/{memberId}")]
        public async Task<IActionResult> GetAllMemberPostInGroup([FromRoute] Guid memberId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetAllMemberPostByMemberQuery(memberId, page, size));
            return Ok(response);
        }

        [HttpGet("group/pending/{groupId}")]
        public async Task<IActionResult> GetAllPendingPostsByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8, [FromQuery] string query = "", [FromQuery] string? userId = null, [FromQuery] string sortOrder = "asc", [FromQuery] string contentType = "all", [FromQuery] DateTimeOffset date = default)
        {
            if (date == default)
            {
                date = DateTimeOffset.UtcNow;
            }

            var response = await _mediator.Send(new GetAllPendingPostsByGroupIdQuery(groupId, page, size, sortOrder, query, userId, contentType, date));
            return Ok(response);
        }

        [HttpPut("group/approval/{groupId}/{postId}")]
        public async Task<IActionResult> ApprovalPostByGroupIdAndPostId([FromRoute] Guid groupId, [FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new ApprovalPostByGroupIdAndPostIdCommand(groupId, postId));
            return Ok(response);
        }

        [HttpPut("group/reject/{groupId}/{postId}")]
        public async Task<IActionResult> RejectPostByGroupIdAndPostId([FromRoute] Guid groupId, [FromRoute] Guid postId)
        {
            var response = await _mediator.Send(new RejectPostByGroupIdAndPostIdCommand(groupId, postId));
            return Ok(response);
        }

        [HttpGet("media/group/{groupId}")]
        public async Task<IActionResult> GetAllGroupPostMediaByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await _mediator.Send(new GetGroupPostMediaByGroupIdQuery(groupId, page, size));
            return Ok(response);
        }

        // MY POST IN GROUP
        [HttpGet("group/pending-posts/{groupId}")]
        public async Task<IActionResult> GetAllMyPendingPostsByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {

            var response = await _mediator.Send(new GetAllPendingPostByGroupIdAndCurrentUserQuery(groupId, page, size));
            return Ok(response);
        }

        [HttpGet("group/rejected-posts/{groupId}")]
        public async Task<IActionResult> GetAllMyRejectedPostByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {

            var response = await _mediator.Send(new GetAllRejectedPostByGroupIdAndUserIdQuery(groupId, page, size));
            return Ok(response);
        }

        [HttpGet("group/approval-posts/{groupId}")]
        public async Task<IActionResult> GetAllMyApprovalPostsByGroupId([FromRoute] Guid groupId, [FromQuery] int page = 1, [FromQuery] int size = 8)
        {

            var response = await _mediator.Send(new GetAllAcceptedPostByGroupIdAndCurrentUserQuery(groupId, page, size));
            return Ok(response);
        }

    }
}
