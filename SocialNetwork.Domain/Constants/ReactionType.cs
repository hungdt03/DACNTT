
namespace SocialNetwork.Domain.Constants
{
    public class ReactionType 
    {
        public const string LIKE = "LIKE";
        public const string LOVE = "LOVE";
        public const string WOW = "WOW";
        public const string HAHA = "HAHA";
        public const string SAD = "SAD";
        public const string ANGRY = "ANGRY";
        public const string CARE = "CARE";

        private static readonly Dictionary<string, string> ReactionTypeToVietnamese = new()
        {
            { ReactionType.LIKE, "Thích" },
            { ReactionType.LOVE, "Yêu thích" },
            { ReactionType.WOW, "Wow" },
            { ReactionType.HAHA, "Haha" },
            { ReactionType.SAD, "Buồn" },
            { ReactionType.ANGRY, "Phẫn nộ" },
            { ReactionType.CARE, "Thương thương" }
        };


        public static bool IsValidReactionType(string reactionType)
        {
            return reactionType == LIKE ||
                   reactionType == LOVE ||
                   reactionType == WOW ||
                   reactionType == HAHA ||
                   reactionType == SAD ||
                   reactionType == ANGRY ||
                   reactionType == CARE;
        }

    
        public static string GetVietnameseReaction(string reactionType)
        {
            if (ReactionTypeToVietnamese.TryGetValue(reactionType, out var vietnameseReaction))
            {
                return vietnameseReaction;
            }

            throw new ArgumentException("Invalid ReactionType value.");
        }
    }
}
