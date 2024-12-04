using SocialNetwork.Application.Features.Comment.Commands;
using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Features.Comment.Validators
{
    public class FileOrContentRequiredAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (validationContext.ObjectInstance is CreateCommentCommand command)
            {
                if (string.IsNullOrWhiteSpace(command.Content) && command.File == null)
                {
                    return new ValidationResult("Nội dung hoặc tệp tin phải được cung cấp.");
                }

                return ValidationResult.Success;
            }

            return new ValidationResult("ObjectInstance is not of the expected type.");
        }
    }
}
