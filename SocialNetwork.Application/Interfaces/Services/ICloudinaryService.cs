

using Microsoft.AspNetCore.Http;

namespace SocialNetwork.Application.Interfaces.Services
{
    public interface ICloudinaryService
    {
        public Task<ICollection<string>> UploadMultiAsync(ICollection<IFormFile> files);
        public Task<string> UploadAsync(IFormFile file);
    }
}
