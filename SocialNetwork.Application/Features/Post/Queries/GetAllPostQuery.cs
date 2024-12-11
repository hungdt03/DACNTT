using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllPostQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllPostQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
