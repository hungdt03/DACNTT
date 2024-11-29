using FluentValidation;
using SocialNetwork.Application.Features.User.Commands;


namespace SocialNetwork.Application.Features.User.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserValidator() {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username không được để trống");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("FullName không được để trống");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password không được để trống");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không đúng định dạng");
        }
    }
}
