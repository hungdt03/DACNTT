﻿

namespace SocialNetwork.Domain.Abstractions
{
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }
        DateTimeOffset DeletedAt { get; set; }
    }
}
