

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Domain.Entity.System
{
    public class Report : BaseAuditableEntity
    {
        public string Reason { get; set; }
        public string ReportType { get; set; }
        public string ResolutionNotes { get; set; }
        public string Status { get; set; }

        public string ReporterId { get; set; }
        public string? TargetUserId { get; set; }
        public Guid? TargetPostId { get; set; }
        public Guid? TargetCommentId { get; set; }

        public User Reporter { get; set; }
        public User? TargetUser { get; set; }
        public Post? TargetPost { get; set; }
        public Comment? TargetComment { get; set; }
        public DateTimeOffset? ResolvedAt { get; set; }

    }
}
