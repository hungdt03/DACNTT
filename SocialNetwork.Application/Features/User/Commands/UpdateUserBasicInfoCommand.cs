﻿
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class UpdateUserBasicInfoCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTimeOffset Birthday { get; set; }
    }
}
