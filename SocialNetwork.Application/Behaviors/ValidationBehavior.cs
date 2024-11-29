using FluentValidation;
using MediatR;
using SocialNetwork.Application.Exceptions;

namespace SocialNetwork.Application.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            // Nếu không có validator nào được đăng ký trong DI, bỏ qua validation.
            if (!_validators.Any())
                return await next();

            // Thực hiện validate tất cả validators được đăng ký cho request này.
            var context = new ValidationContext<TRequest>(request);
            var validationResults = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken))
            );

            // Gom lại tất cả các lỗi.
            var failures = validationResults
                .SelectMany(result => result.Errors)
                .Where(f => f != null)
                .ToList();

            // Nếu có lỗi, ném ValidationException.
            if (failures.Count != 0)
            {
                var firstError = failures.FirstOrDefault();
                if (firstError != null)
                {
                    throw new AppException(firstError.ErrorMessage);
                }
            }

            return await next();
        }
    }
}
