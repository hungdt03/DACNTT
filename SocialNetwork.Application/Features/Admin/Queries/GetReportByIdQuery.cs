using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetReportByIdQuery : IRequest<BaseResponse>
    {
        public Guid reportId {  get; set; }
        public GetReportByIdQuery(Guid id) { reportId = id; }
    }
}
