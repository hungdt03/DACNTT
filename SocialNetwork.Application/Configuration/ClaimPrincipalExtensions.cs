
using System.Security.Claims;

namespace SocialNetwork.Application.Configuration
{
    public static class ClaimPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Sid)!;
        }

        public static string GetUserEmail(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Email)!;
        }
    }
}
