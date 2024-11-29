using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllPostQuery : IRequest<BaseResponse>
    {
    }
}
