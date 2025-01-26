
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IProfessionRepository
    {
        Task CreateNewProfessionAsync(Profession profession);
    }
}
