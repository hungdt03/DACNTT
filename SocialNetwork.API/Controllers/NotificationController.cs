using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Notification.Commands;
using SocialNetwork.Application.Features.Notification.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly IMediator mediator;

        public NotificationController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotifications([FromQuery] int page = 1, [FromQuery] int size = 6)
        {
            var response = await mediator.Send(new GetAllNotificationsQuery(page, size));
            return Ok(response);
        }

        [HttpPut("{notificationId}")]
        public async Task<IActionResult> MarkNotificationAsRead([FromRoute] Guid notificationId)
        {
            var response = await mediator.Send(new MarkNotificationAsReadCommand(notificationId));
            return Ok(response);
        }

        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> DeleteNotificationById([FromRoute] Guid notificationId)
        {
            var response = await mediator.Send(new RemoveNotificationCommand(notificationId));
            return Ok(response);
        }
    }
}
