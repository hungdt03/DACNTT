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
    public class UserScoreCommand : IRequest<BaseResponse>
    {
        public int Score { get; set; }
        public UserResponse User { get; set; }
        public UserScoreCommand(int Score, UserResponse user) { 
            this.Score = Score;
            this.User = user;
        }
    }
}
