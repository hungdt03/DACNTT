using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Common.Attributes
{
    public class VideoFileAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value != null && value is List<IFormFile> files)
            {
                foreach (var file in files)
                {
                    if (file != null && !file.ContentType.StartsWith("video/"))
                    {
                        return new ValidationResult($"Tệp '{file.FileName}' không phải là video hợp lệ.");
                    }
                }
            }
            return ValidationResult.Success;
        }
    }
}
