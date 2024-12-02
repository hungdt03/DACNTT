
using Microsoft.AspNetCore.Http;
using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Contracts.Requests
{
    public class EditPostRequest
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        public string Privacy { get; set; } = PrivacyConstant.PUBLIC;
        public List<Guid>? RemoveMediaIds { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }
        public List<string>? TagIds { get; set; }
    }
}
