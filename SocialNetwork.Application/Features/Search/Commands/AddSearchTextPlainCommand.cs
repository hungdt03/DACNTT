

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Search.Commands
{
    public class AddSearchTextPlainCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Từ khóa tìm kiếm không được để trống")]
        public string Text { get; set; }

        public AddSearchTextPlainCommand(string text)
        {
            Text = text;
        }
    }
}
