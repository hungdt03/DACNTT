using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class DeleteManyUserQuery : IRequest<BaseResponse>
    {
        public List<string> listUserId { get; set; }
        public DeleteManyUserQuery(List<string> listUserId)
        {
            this.listUserId = listUserId;
        }
    }
}
