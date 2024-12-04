
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace SocialNetwork.Application.Common.Helpers
{
    public class FileValidationHelper
    {
        public static bool IsImageFile(IFormFile file)
        {
            if (file == null) return false;

            var allowedImageTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp" };
            var allowedImageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };

            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            return allowedImageTypes.Contains(file.ContentType) && allowedImageExtensions.Contains(fileExtension);
        }

        public static bool IsVideoFile(IFormFile file)
        {
            if (file == null) return false;

            var allowedVideoTypes = new[] { "video/mp4", "video/avi", "video/mpeg", "video/webm", "video/quicktime" };
            var allowedVideoExtensions = new[] { ".mp4", ".avi", ".mpeg", ".webm", ".mov" };

            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            return allowedVideoTypes.Contains(file.ContentType) && allowedVideoExtensions.Contains(fileExtension);
        }
    }
}
