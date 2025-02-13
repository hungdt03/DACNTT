using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class UnLockAndLockManyAccountQuery : IRequest<BaseResponse>
    {
        public List<string> listUserId { get; set; }
        public string number { get; set; }
        public UnLockAndLockManyAccountQuery( List<string> listUsers, string num) {
            listUserId = listUsers;
            number = num;
        }   
    }
}
