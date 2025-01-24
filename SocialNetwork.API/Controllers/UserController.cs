using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Features.User.Commands;
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

        [HttpPost("modify-education")]
        public async Task<IActionResult> ModifyEducation([FromBody] ModifyUserEducationCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
