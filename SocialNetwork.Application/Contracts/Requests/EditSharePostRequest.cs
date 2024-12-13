

using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Contracts.Requests
{
    public class EditSharePostRequest
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        public string Privacy { get; set; } = PrivacyConstant.PUBLIC;
        public List<Guid>? RemoveTagIds { get; set; }
        public List<string>? TagIds { get; set; }
    }
}
