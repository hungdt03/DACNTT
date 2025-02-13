using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.BlockList.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class GetBlockByUserIdHandler : IRequestHandler<GetBlockByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetBlockByUserIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetBlockByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var blockList = await _unitOfWork.BlockListRepository
                .GetBlockListByUserIdAndUserIdAsync(userId, request.UserId)
                ?? throw new NotFoundException("Bạn và người này không chặn nhau");

            return new DataResponse<BlockResponse>
            {
                Data = ApplicationMapper.MapToBlock(blockList),
                IsSuccess = true,
                Message = "Lấy thông tin chặn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
