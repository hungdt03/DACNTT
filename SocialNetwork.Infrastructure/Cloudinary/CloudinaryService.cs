
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Infrastructure.Options;

namespace SocialNetwork.Infrastructure.Cloudinary
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinaryOptions> options)
        {
            var account = new Account(
               options.Value.CloudName,
               options.Value.ApiKey,
               options.Value.ApiSecret
           );

            _cloudinary = new CloudinaryDotNet.Cloudinary(account);
        }
        #region Upload Images
        public async Task<string> UploadImageAsync(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "SocialNetworkStorage/Images",
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new AppException("Upload hình ảnh thất bại");
                }
            }
        }

        public async Task<ICollection<string>> UploadMultipleImagesAsync(ICollection<IFormFile> files)
        {
            var uploadResults = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(file.FileName, stream),
                            Folder = "SocialNetworkStorage/Images",
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                        {
                            uploadResults.Add(uploadResult.SecureUrl.ToString());
                        }
                    }
                }
            }

            return uploadResults;
        }
        #endregion

        #region Upload Videos
        public async Task<string> UploadVideoAsync(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                var uploadParams = new VideoUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "SocialNetworkStorage/Videos",
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new AppException("Upload video thất bại");
                }
            }
        }

        public async Task<ICollection<string>> UploadMultipleVideosAsync(ICollection<IFormFile> files)
        {
            var uploadResults = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        var uploadParams = new VideoUploadParams()
                        {
                            File = new FileDescription(file.FileName, stream),
                            Folder = "SocialNetworkStorage/Videos",
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                        {
                            uploadResults.Add(uploadResult.SecureUrl.ToString());
                        }
                    }
                }
            }

            return uploadResults;
        }
        #endregion
    }
}
