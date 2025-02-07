
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Contracts.Requests
{
    public class EditPostRequest
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        [PrivacyValidation]
        public string Privacy { get; set; } = PrivacyConstant.PUBLIC;
        public List<Guid>? RemoveMediaIds { get; set; }
        public List<Guid>? RemoveTagIds { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }
        public List<string>? TagIds { get; set; }
        public string? Background { get; set; }
    }
}
