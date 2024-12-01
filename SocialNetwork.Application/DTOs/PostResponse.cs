using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.DTOs
{
    public class PostResponse
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string Privacy { get; set; }
        public List<MediaResponse> Medias { get; set; }
        public UserResponse User { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int Comments { get; set; }

    }
}
