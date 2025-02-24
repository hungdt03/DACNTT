using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class UnLockAndLockOneAccountHandler : IRequestHandler<UnLockAndLockOneAccountQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public UnLockAndLockOneAccountHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(UnLockAndLockOneAccountQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.UserRepository.UnLockAndLockOneAccount(request.userId);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật trạng thái tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
