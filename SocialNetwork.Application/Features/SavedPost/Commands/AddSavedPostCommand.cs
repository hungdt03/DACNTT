
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.SavedPost.Commands
{
    public class AddSavedPostCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID bài viết không được để trống")]
        public Guid PostId { get; set; }
    }
}
