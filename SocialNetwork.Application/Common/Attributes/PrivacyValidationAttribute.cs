using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Common.Attributes
{
    public class PrivacyValidationAttribute : ValidationAttribute
    {
        private static readonly string[] AllowedValues =
        {
            PrivacyConstant.PRIVATE,
            PrivacyConstant.FRIENDS,
            PrivacyConstant.PUBLIC
        };

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is string privacyType && AllowedValues.Contains(privacyType))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("Giá trị quyền riêng tư không hợp lệ. Chỉ chấp nhận PRIVATE, FRIENDS hoặc PUBLIC.");
        }
    }
}
