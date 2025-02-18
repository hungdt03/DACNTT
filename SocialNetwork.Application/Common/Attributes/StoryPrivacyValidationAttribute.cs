using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Common.Attributes
{
    public class StoryPrivacyValidationAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var privacyValue = value as string;

            if (string.IsNullOrEmpty(privacyValue))
            {
                return false;
            }

            // Kiểm tra giá trị có hợp lệ hay không
            return privacyValue == PrivacyConstant.PRIVATE ||
                   privacyValue == PrivacyConstant.FRIENDS ||
                   privacyValue == PrivacyConstant.PUBLIC;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"{name} phải có giá trị là {PrivacyConstant.PRIVATE}, {PrivacyConstant.FRIENDS}, hoặc {PrivacyConstant.PUBLIC}.";
        }
    }
}
