using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class DeleteManyPostQuery : IRequest<BaseResponse>
    {
        public List<string> listPostId { get; set; }
        public DeleteManyPostQuery(List<string> listPostId)
        {
            this.listPostId = listPostId;
        }
    }
}
