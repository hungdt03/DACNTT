using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllUserQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }
        public string Search {  get; set; }

        public GetAllUserQuery(int page, int size, string search)
        {
            Page = page;
            Size = size;
            Search = search;
        }
    }
}
