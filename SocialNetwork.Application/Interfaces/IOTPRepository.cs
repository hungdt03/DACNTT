﻿using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IOTPRepository
    {
        Task CreateNewOTPAsync(OTP oTP);
        Task<bool> IsExistOtpAsync(string userId, string otpCode, string otpType);
        Task<OTP?> GetOtpByCodeAndEmailAndTypeAsync(string optCode, string email, string type);
        Task<OTP?> GetLastOtpByEmailAndTypeAsync(string email, string type);
        Task<OTP?> GetLastOtpByUserIdAndTypeAsync(string userId, string type);
        void DeleteOtp(OTP oTP);
    }
}
