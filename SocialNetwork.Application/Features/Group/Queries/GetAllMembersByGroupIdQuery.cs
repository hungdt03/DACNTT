﻿
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetAllMembersByGroupIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }

        public GetAllMembersByGroupIdQuery(Guid groupId, int page, int size)
        {
            GroupId = groupId;
            Page = page;
            Size = size;
        }
    }
}
