using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Domain.Entity;
using System.Security.Claims;

namespace SocialNetwork.Application.Interfaces.Services
{
    public interface ITokenService
    {
        public Task<TokenResponse> GenerateTokenAsync(User user);
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string accessToken);
    }
}
