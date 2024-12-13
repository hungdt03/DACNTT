using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;
using SocialNetwork.Infrastructure.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SocialNetwork.Infrastructure.JsonWebToken
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<User> userManager;
        private readonly AppDbContext _context;
        private readonly JwtOptions _jwtOptions;

        public TokenService(UserManager<User> userManager, AppDbContext context, IOptions<JwtOptions> jwtOptions)
        {
            this.userManager = userManager;
            _context = context;
            _jwtOptions = jwtOptions.Value;
        }

        public async Task<TokenResponse> GenerateTokenAsync(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var secretKeyBytes = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
            var credentials = new SigningCredentials(secretKeyBytes, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Sid, user.Id),
                new Claim("Avatar", user.Avatar),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = credentials,
                Issuer = _jwtOptions.Issuer,
                Audience = _jwtOptions.Audience,
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var accessToken = jwtTokenHandler.WriteToken(token);
            var refreshToken = await GenerateRefreshTokenAsync();

            //var newRefreshToken = new AppToken()
            //{
            //    UserId = user.Id,
            //    JwtId = token.Id,
            //    RefreshToken = refreshToken,
            //    IssuedAt = DateTime.Now,
            //    ExpiredAt = DateTime.UtcNow.AddHours(5),
            //    IsRevoked = false,
            //};

            //await _context.AppTokens.AddAsync(newRefreshToken);
            //int rows = await _context.SaveChangesAsync();

            //if (rows == 0) throw new AppException("Có lỗi xảy ra khi tạo refresh token");

            return new TokenResponse
            {
                RefreshToken = refreshToken,
                AccessToken = accessToken,
            };
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string accessToken)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = true,
                ValidIssuer = _jwtOptions.Issuer,
                ValidAudience = _jwtOptions.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;

            var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        private Task<string> GenerateRefreshTokenAsync()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
            }
            return Task.FromResult(Convert.ToBase64String(randomNumber));
        }
    }
}
