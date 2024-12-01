
using SocialNetwork.Application.DTOs;

namespace SocialNetwork.Application.Contracts.Responses
{
    public class AuthResponse
    {
        public UserResponse User { get; set; }
        public TokenResponse Token {  get; set; }
    }
}
