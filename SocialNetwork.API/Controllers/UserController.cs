using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Features.BlockList.Commands;
using SocialNetwork.Application.Features.BlockList.Queries;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Features.User.Handlers;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator mediator;

        public UserController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetUserByIdQuery(userId));
            return Ok(response);
        }

        [HttpGet("blocks")]
        public async Task<IActionResult> GetAllBlockUsers([FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllBlockUsersQuery(page, size));
            return Ok(response);
        }
      
        [HttpPut("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarComand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("coverImage")]
        public async Task<IActionResult> UploadCoverImage([FromForm] UploadCoverImageCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPost("modify-bio")]
        public async Task<IActionResult> ModifyBio([FromBody] ModifyBioCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        // EDUCATION
        [HttpGet("education")]
        public async Task<IActionResult> GetUserEducation()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetAllUserSchoolQuery(userId));
            return Ok(response);
        }

        [HttpGet("education/{userId}")]
        public async Task<IActionResult> GetUserEducationByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetAllUserSchoolQuery(userId));
            return Ok(response);
        }


        [HttpPost("education")]
        public async Task<IActionResult> AddUserEducation([FromBody] AddUserEducationCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("education/{userSchoolId}")]
        public async Task<IActionResult> UpdateUserEducation([FromRoute] Guid userSchoolId, [FromBody] UpdateUserEducationRequest userSchool)
        {
            var response = await mediator.Send(new UpdateUserEducationCommand(userSchoolId, userSchool));
            return Ok(response);
        }

        [HttpDelete("education/{userSchoolId}")]
        public async Task<IActionResult> DeleteUserEducation([FromRoute] Guid userSchoolId)
        {
            var response = await mediator.Send(new DeleteUserSchoolCommand(userSchoolId));
            return Ok(response);
        }

        // WORK PLACE

        [HttpGet("workPlace")]
        public async Task<IActionResult> GetUserWorkPlace()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetAllUserWorkPlaceQuery(userId));
            return Ok(response);
        }

        [HttpGet("workPlace/{userId}")]
        public async Task<IActionResult> GetUserWorkPlaceByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetAllUserWorkPlaceQuery(userId));
            return Ok(response);
        }


        [HttpPost("workPlace")]
        public async Task<IActionResult> AddUserWorkPlace([FromBody] AddUserWorkPlaceCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("workPlace/{userWorkPlaceId}")]
        public async Task<IActionResult> UpdateUserWorkPlace([FromRoute] Guid userWorkPlaceId, [FromBody] UpdateUserWorkPlaceRequest userWorkPlace)
        {
            var response = await mediator.Send(new UpdateUserWorkPlaceCommand(userWorkPlaceId, userWorkPlace));
            return Ok(response);
        }

        [HttpDelete("workPlace/{userWorkPlaceId}")]
        public async Task<IActionResult> DeleteUserWorkPlace([FromRoute] Guid userWorkPlaceId)
        {
            var response = await mediator.Send(new DeleteUserWorkPlaceCommand(userWorkPlaceId));
            return Ok(response);
        }

        // HOMETOWN
        [HttpPost("hometown")]
        public async Task<IActionResult> ModifyUserHometown([FromBody] ModifyUserHometownCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("hometown/{userId}")]
        public async Task<IActionResult> GetHomeTownByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetUserHometownByUserIdQuery(userId));
            return Ok(response);
        }

        [HttpGet("hometown")]
        public async Task<IActionResult> GetUserHometown()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetUserHometownByUserIdQuery(userId));
            return Ok(response);
        }

        // CURRENT LOCATION
        [HttpPost("location")]
        public async Task<IActionResult> ModifyUserLocation([FromBody] ModifyUserLocationCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("location/{userId}")]
        public async Task<IActionResult> GetLocationByUserId([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetUserLocationByUserIdQuery(userId));
            return Ok(response);
        }

        [HttpGet("location")]
        public async Task<IActionResult> GetUserLocation()
        {
            var userId = HttpContext.User.GetUserId();
            var response = await mediator.Send(new GetUserLocationByUserIdQuery(userId));
            return Ok(response);
        }

        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] AddBlockUserCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("unblock/{userId}")]
        public async Task<IActionResult> UnblockUser([FromRoute] string userId)
        {
            var response = await mediator.Send(new RemoveBlockUserCommand(userId));
            return Ok(response);
        }


        [HttpGet("block/{userId}")]
        public async Task<IActionResult> CheckIsBlockUser([FromRoute] string userId)
        {
            var response = await mediator.Send(new CheckIsBlockUserQuery(userId));
            return Ok(response);
        }

    }
}
