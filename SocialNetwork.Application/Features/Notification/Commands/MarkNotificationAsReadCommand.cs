

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Notification.Commands
{
    public class MarkNotificationAsReadCommand : IRequest<BaseResponse>
    {
        public Guid NotificationId { get; set; }

        public MarkNotificationAsReadCommand(Guid notificationId)
        {
            NotificationId = notificationId;
        }
    }
}
