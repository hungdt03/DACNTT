
using System.Security.Claims;

namespace SocialNetwork.Application.Configuration
{
    public static class ClaimPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Sid)!;
        }

        public static string GetFullName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Name)!;
        }

        public static string GetAvatar(this ClaimsPrincipal user)
        {
            return user.FindFirstValue("Avatar")!;
        }

        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        public static string GetUserEmail(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Email)!;
        }
    }
}
