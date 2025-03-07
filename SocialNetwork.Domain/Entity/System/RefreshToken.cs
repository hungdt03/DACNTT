﻿
using SocialNetwork.Domain.Abstractions;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Domain.Entity.System
{
    public class RefreshToken : ISoftDelete
    {
        [Key]
        public string Token { get; set; }
        public bool IsRevoked { get; set; }
        public string JwtId { get; set; }
        public bool IsUsed { get; set; }
        public DateTimeOffset IssuedAt { get; set; }
        public DateTimeOffset ExpiredAt { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset DeletedAt { get; set; }
    }
}
