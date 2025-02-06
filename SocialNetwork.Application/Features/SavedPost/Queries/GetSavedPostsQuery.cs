
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.SavedPost.Queries
{
    public class GetSavedPostsQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetSavedPostsQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
