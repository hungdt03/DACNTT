using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Notification.Commands
{
    public class RemoveNotificationCommand : IRequest<BaseResponse>
    {
        public Guid NotificationId { get; set; }

        public RemoveNotificationCommand(Guid notificationId)
        {
            NotificationId = notificationId;
        }
    }
}
