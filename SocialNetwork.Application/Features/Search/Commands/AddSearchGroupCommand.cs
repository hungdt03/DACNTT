
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Search.Commands
{
    public class AddSearchGroupCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "GroupId không được để trống")]
        public Guid GroupId { get; set; }

        public AddSearchGroupCommand(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
