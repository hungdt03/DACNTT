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
    public class DeleteUserHandler : IRequestHandler<DeleteUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteUserHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteUserQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.UserRepository.DeleteUser(request.id);
   
            return new BaseResponse()
            {
            
                IsSuccess = true,
                Message = "Xóa tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
