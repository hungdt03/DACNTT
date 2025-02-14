using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class DeleteOneReportQuery : IRequest<BaseResponse>
    {
        public Guid id { get; set; }
        public DeleteOneReportQuery(Guid id)
        {
            this.id = id;
        }
    }
}
