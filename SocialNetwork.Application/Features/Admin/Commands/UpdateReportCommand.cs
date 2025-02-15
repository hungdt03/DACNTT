using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Commands
{
    public class UpdateReportCommand : IRequest<BaseResponse>
    {
        public Guid Id { get; set; }
        public string NewStatus { get; set; }
        public UpdateReportCommand(Guid Id, string NewStatus) {
            this.Id = Id;
            this.NewStatus = NewStatus;
        }
    }
}
