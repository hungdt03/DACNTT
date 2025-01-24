

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Story.Commands
{
    public class ModifyBioCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp thông tin tiểu sử")]
        [MaxLength(50, ErrorMessage = "Tiểu sử không được vượt quá 50 kí tự")]
        public string Bio {  get; set; }
    }
}
