
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Message.Commands
{
    public class ReadMessageCommand : IRequest<BaseResponse>
    {
        public Guid MessageId { get; set; }

        public ReadMessageCommand(Guid messageId)
        {
            MessageId = messageId;
        }
    }
}
