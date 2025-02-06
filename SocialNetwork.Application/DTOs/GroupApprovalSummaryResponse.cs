

namespace SocialNetwork.Application.DTOs
{
    public class GroupApprovalSummaryResponse
    {
        public int PendingPost { get; set; }
        public int PendingReports { get; set; }
        public int PendingRequestJoinGroup { get; set; }
    }
}
