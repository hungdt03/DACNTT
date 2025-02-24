using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;

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
                Message = "Cập nhật trạng thái các tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
