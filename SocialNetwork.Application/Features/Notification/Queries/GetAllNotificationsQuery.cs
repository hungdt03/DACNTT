
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Notification.Queries
{
    public class GetAllNotificationsQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllNotificationsQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
