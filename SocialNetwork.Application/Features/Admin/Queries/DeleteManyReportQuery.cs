using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class DeleteManyReportQuery : IRequest<BaseResponse>
    {
        public List<string> listReportId { get; set; }
        public DeleteManyReportQuery(List<string> listReportId)
        {
            this.listReportId = listReportId;
        }
    }
}
