
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Contracts.Requests
{
    public class UpdateUserEducationRequest
    {
        [Required(ErrorMessage = "Tên trường học không được để trống")]
        public string School { get; set; }
        public string Major { get; set; }
        public Guid? SchoolId { get; set; }
        public bool IsGraduated { get; set; }
        public int? StartYear { get; set; }
        public Guid? MajorId { get; set; }
    }
}
