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
    public class DeleteManyUserHandler : IRequestHandler<DeleteManyUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteManyUserHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteManyUserQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.UserRepository.DeleteManyUser(request.listUserId);
   
            return new BaseResponse()
            {
         
                IsSuccess = true,
                Message = "Xóa các tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
