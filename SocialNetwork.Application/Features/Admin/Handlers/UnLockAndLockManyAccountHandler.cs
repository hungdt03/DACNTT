using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class UnLockAndLockManyAccountHandler : IRequestHandler<UnLockAndLockManyAccountQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public UnLockAndLockManyAccountHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(UnLockAndLockManyAccountQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.UserRepository.UnLockAndLockManyAccount(request.listUserId, request.number);

            return new BaseResponse()
            {
          
                IsSuccess = true,
                Message = "các tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
