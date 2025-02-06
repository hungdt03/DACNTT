

using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Constants
{
    public class ReportType : BaseAuditableEntity
    {
        public const string USER = "USER";
        public const string COMMENT = "COMMENT";
        public const string POST = "POST";
        public const string GROUP = "GROUP";
    }
}
