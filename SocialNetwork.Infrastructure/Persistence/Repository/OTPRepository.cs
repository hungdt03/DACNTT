using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class OTPRepository : IOTPRepository
    {
        private readonly AppDbContext _context;

        public OTPRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNewOTPAsync(OTP oTP)
        {
            await _context.OTPs.AddAsync(oTP);
        }

        public void DeleteOtp(OTP oTP)
        {
            _context.OTPs.Remove(oTP);
        }

        public async Task<OTP?> GetLastOtpByEmailAndTypeAsync(string email, string type)
        {
            return await _context.OTPs
                .Include(o => o.User)
                .OrderByDescending(o => o.DateCreated)
                .FirstOrDefaultAsync(o => o.ExpiresAt > DateTimeOffset.UtcNow && o.User.Email == email && o.Type == type);
        }

        public async Task<OTP?> GetOtpByCodeAndEmailAndTypeAsync(string optCode, string email, string type)
        {
            return await _context.OTPs
                .Include(o => o.User)
                .SingleOrDefaultAsync(o => o.ExpiresAt > DateTimeOffset.UtcNow && o.Code == optCode && o.User.Email == email && o.Type == type);
        }

        public async Task<bool> IsExistOtpAsync(string userId, string otpCode, string otpType)
        {
            return await _context.OTPs.AnyAsync(o => o.ExpiresAt > DateTimeOffset.UtcNow && o.UserId == userId && o.Type == otpType && o.Code == otpCode);
        }
    }
}
