

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.BlockList.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class CheckIsBlockUserHandler : IRequestHandler<CheckIsBlockUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CheckIsBlockUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CheckIsBlockUserQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var block = await _unitOfWork.BlockListRepository.GetBlockListByBlockeeIdAndBlockerIdAsync(request.UserId, userId);
            var reverseBlock = await _unitOfWork.BlockListRepository.GetBlockListByBlockeeIdAndBlockerIdAsync(userId, request.UserId);

            if(block != null || reverseBlock != null)
            {
                return new DataResponse<bool>()
                {
                    IsSuccess = true,
                    Message = "Lấy dữ liệu chặn thành công",
                    Data = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                };
            }

            return new DataResponse<bool>()
            {
                IsSuccess = false,
                Message = "Lấy dữ liệu chặn thành công",
                Data = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
