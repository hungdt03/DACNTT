﻿
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetGroupVideosQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetGroupVideosQuery(Guid groupId, int page, int size)
        {
            GroupId = groupId;
            Page = page;
            Size = size;
        }
    }
}
