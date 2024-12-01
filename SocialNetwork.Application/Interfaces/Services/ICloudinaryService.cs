

using Microsoft.AspNetCore.Http;

namespace SocialNetwork.Application.Interfaces.Services
{
    public interface ICloudinaryService
    {
        public Task<ICollection<string>> UploadMultipleImagesAsync(ICollection<IFormFile> files);
        public Task<string> UploadImageAsync(IFormFile file);
        public Task<ICollection<string>> UploadMultipleVideosAsync(ICollection<IFormFile> files);
        public Task<string> UploadVideoAsync(IFormFile file);
    }
}
