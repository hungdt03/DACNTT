using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Contracts.Requests
{
    public class UpdateGroupRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên nhóm")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mô tả nhóm")]
        public string Description { get; set; }
        public bool IsHidden { get; set; }
        public bool IsPublic { get; set; }
        public bool OnlyAdminCanPost { get; set; }
        public bool OnlyAdminCanApprovalMember { get; set; }
        public bool IsApprovalPost { get; set; }
        public bool IsApprovalMember { get; set; }
    }
}
