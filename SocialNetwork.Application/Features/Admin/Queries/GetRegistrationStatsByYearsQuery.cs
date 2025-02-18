using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetRegistrationStatsByYearsQuery : IRequest<BaseResponse>
    {
        public int year { get;set; }
        public GetRegistrationStatsByYearsQuery(int year) {
            this.year = year;
        }
    }
}
