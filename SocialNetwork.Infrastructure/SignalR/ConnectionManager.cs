

namespace SocialNetwork.Infrastructure.SignalR
{
    public class ConnectionManager
    {
        private static readonly Dictionary<string, List<string>> ConnectionUsers = new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string userId, string connectionId)
        {
            bool isOnline = false;
            lock (ConnectionUsers)
            {
                if (ConnectionUsers.ContainsKey(userId))
                {
                    ConnectionUsers[userId].Add(connectionId);
                }
                else
                {
                    ConnectionUsers.Add(userId, new List<string> { connectionId });
                    isOnline = true;
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string userId, string connectionId)
        {
            bool isOffline = false;
            lock (ConnectionUsers)
            {
                if (!ConnectionUsers.ContainsKey(userId)) return Task.FromResult(isOffline);

                ConnectionUsers[userId].Remove(connectionId);
                if (ConnectionUsers[userId].Count == 0)
                {
                    ConnectionUsers.Remove(userId);
                    isOffline = true;
                }
            }

            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (ConnectionUsers)
            {
                onlineUsers = ConnectionUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public Task<List<string>> GetConnectionsForUser(string userId)
        {
            List<string> connectionIds;
            lock (ConnectionUsers)
            {
                connectionIds = ConnectionUsers.GetValueOrDefault(userId);
            }

            return Task.FromResult(connectionIds);
        }
    }
}
