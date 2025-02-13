using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Commands
{
    public class UnlockAndLockManyAccountCommand : IRequest<BaseResponse>
    {
        public List<string> listUserId{ get; set; }
        public string number { get; set; }
    }
}
