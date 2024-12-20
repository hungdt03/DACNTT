

using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Contracts.Requests
{
    public class MessageRequest
    {
        public string Content { get; set; }
        public string ChatRoomName { get; set; }
       
    }
}
