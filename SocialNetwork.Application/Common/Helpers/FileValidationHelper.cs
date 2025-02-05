
using Microsoft.AspNetCore.Http;

namespace SocialNetwork.Application.Common.Helpers
{
    public class FileValidationHelper
    {
        public static bool IsImageFile(IFormFile file)
        {
            if (file == null) return false;
            return file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsVideoFile(IFormFile file)
        {
            if (file == null) return false;
            return file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase);
        }

        public static bool AreFilesTooLarge(List<IFormFile> files, long maxSizeInBytes)
        {
            if (files == null || files.Count == 0)
            {
                throw new ArgumentNullException(nameof(files), "Danh sách tệp không được null hoặc rỗng");
            }

            long totalSize = files.Sum(file => file.Length);
            return totalSize > maxSizeInBytes;
        }
    }
}
