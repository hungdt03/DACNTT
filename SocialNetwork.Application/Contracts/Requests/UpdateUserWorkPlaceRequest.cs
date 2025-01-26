

namespace SocialNetwork.Application.Contracts.Requests
{
    public class UpdateUserWorkPlaceRequest
    {
        public Guid? PositionId { get; set; }
        public string Position { get; set; }
        public Guid? CompanyId { get; set; }
        public string Company { get; set; }
        public bool IsCurrent { get; set; }
        public int? StartYear { get; set; }
    }
}
