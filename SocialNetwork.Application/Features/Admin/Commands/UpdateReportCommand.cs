using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Commands
{
    public class UpdateReportCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp ID của báo cáo")]
        public Guid Id { get; set; }
        public string NewStatus { get; set; }
    }
}
