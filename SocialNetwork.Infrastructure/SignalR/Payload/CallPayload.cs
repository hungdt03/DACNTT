
namespace SocialNetwork.Infrastructure.SignalR.Payload
{
    public class CallPayload
    {
        public string UserToCall { get; set; }
        public object SignalData { get; set; }
    }
}
