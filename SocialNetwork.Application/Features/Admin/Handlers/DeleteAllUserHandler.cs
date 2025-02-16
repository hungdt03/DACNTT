using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class DeleteAllUserHandler : IRequestHandler<DeleteAllUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteAllUserHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteAllUserQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.UserRepository.DeleteAllUser();
   
            return new BaseResponse()
            {
            
                IsSuccess = true,
                Message = "Xóa tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
