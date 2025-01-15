

using System.Security.Cryptography;

namespace SocialNetwork.Application.Common.Helpers
{
    public class OtpHelper
    {
        public static string GenerateSecureOTP()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] bytes = new byte[4]; // Mảng byte có thể tạo ra một số nguyên 32-bit
                rng.GetBytes(bytes);
                int otp = Math.Abs(BitConverter.ToInt32(bytes, 0)) % 1000000; // Chuyển thành số nguyên và lấy 6 chữ số
                return otp.ToString("D6"); // Đảm bảo luôn có đủ 6 chữ số (thêm 0 ở đầu nếu cần)
            }
        }
    }
}
