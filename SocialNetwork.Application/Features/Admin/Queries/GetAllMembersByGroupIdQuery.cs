

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllMembersByGroupIdQuery : IRequest<BaseResponse>
    { 
        public Guid GroupId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string Search {  get; set; }
        public string Role { get; set; }

        public GetAllMembersByGroupIdQuery(Guid groupId, int page, int size, string search, string role)
        {
            Page = page;
            Size = size;
            Search = search;
            Role = role;
            GroupId = groupId;
        }
    }
}
