
namespace SocialNetwork.Application.DTOs
{
    public class ReportResponse
    {
        public Guid Id { get; set; }
        public string Reason { get; set; }
        public string ReportType { get; set; }
        public string ResolutionNotes { get; set; }
        public string Status { get; set; }

        public GroupResponse? Group { get; set; }
        public UserResponse Reporter { get; set; }
        public UserResponse? TargetUser { get; set; }
        public PostResponse? TargetPost { get; set; }
        public GroupResponse? TargetGroup { get; set; }
        public CommentResponse? TargetComment { get; set; }
        public DateTimeOffset? ResolvedAt { get; set; }
        public DateTimeOffset? DateCreatedAt { get; set; }
    }
}
