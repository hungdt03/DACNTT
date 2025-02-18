using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetTop10UserActiveQuery : IRequest<BaseResponse>
    {
        public GetTop10UserActiveQuery() {

        }
    }
}
