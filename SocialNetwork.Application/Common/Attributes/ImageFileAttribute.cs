using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace SocialNetwork.Application.Common.Attributes
{
    public class ImageFileAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is IFormFile file) // Kiểm tra 1 file duy nhất
            {
                return ValidateFile(file);
            }
            else if (value is List<IFormFile> files) // Kiểm tra danh sách file
            {
                foreach (var f in files)
                {
                    var result = ValidateFile(f);
                    if (result != ValidationResult.Success)
                    {
                        return result;
                    }
                }
            }

            return ValidationResult.Success;
        }

        private ValidationResult? ValidateFile(IFormFile file)
        {
            if (file != null && !file.ContentType.StartsWith("image/"))
            {
                return new ValidationResult($"Tệp '{file.FileName}' không phải là hình ảnh hợp lệ.");
            }
            return ValidationResult.Success;
        }
    }
}
