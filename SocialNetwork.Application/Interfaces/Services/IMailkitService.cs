
namespace SocialNetwork.Application.Interfaces.Services
{
    public interface IMailkitService
    {
        Task SendOtpAccountVerificationAsync(string to, string otp, string fullName);
        Task SendOtpForgotPasswordAsync(string to, string otp, string fullName);
        Task SendOtpChangeEmailAsync(string to, string otp, string fullName);
    }
}
