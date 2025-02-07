

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.BlockList.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class RemoveBlockUserHandler : IRequestHandler<RemoveBlockUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public RemoveBlockUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(RemoveBlockUserCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("Thông tin người dùng bạn cung cấp không tồn tại");

            var blockUser = await _unitOfWork.BlockListRepository
                .GetBlockListByBlockeeIdAndBlockerIdAsync(request.UserId, userId)
                    ?? throw new AppException("Bạn chưa chặn người dùng này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.BlockListRepository.RemoveBlockList(blockUser);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                Message = $"Bạn đã bỏ chặn {user.FullName}",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
