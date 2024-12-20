
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Utils
{
    public class ChatUtils
    {
        public static string GenerateChatRoomName(List<string> userIds)
        {
            // Sort the users by their names
            var sortedUserIds = userIds.OrderBy(u => u).ToList();

            // Combine the sorted names into a single string
            var userNamesString = string.Join("-", sortedUserIds);

            // Get the current time to ensure uniqueness
            var currentTime = DateTimeOffset.UtcNow.ToString("yyyyMMddHHmmss");

            // Return the chat room name with user names and the current timestamp
            return $"{userNamesString}-{currentTime}";
        }
    }
}
