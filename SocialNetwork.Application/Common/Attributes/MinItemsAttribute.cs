
using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Common.Attributes
{
    public class MinItemsAttribute : ValidationAttribute
    {
        private readonly int _minItems;

        public MinItemsAttribute(int minItems)
        {
            _minItems = minItems;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var list = value as IList;
            if (list == null || list.Count < _minItems)
            {
                return new ValidationResult(ErrorMessage ?? $"Danh sách phải chứa ít nhất {_minItems} phần tử.");
            }

            return ValidationResult.Success;
        }
    }
}
