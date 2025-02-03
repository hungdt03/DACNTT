

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class CancelJoinGroupRequestHandler : IRequestHandler<CancelJoinGroupRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CancelJoinGroupRequestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CancelJoinGroupRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var joinRequest = await _unitOfWork.JoinGroupRequestRepository
                .GetJoinGroupRequestByIdAsync(request.RequestId)
                    ?? throw new NotFoundException("Yêu cầu không tồn tại");

            if (userId != joinRequest.UserId)
                throw new AppException("Bạn không có quyền hủy bỏ yêu cầu này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.JoinGroupRequestRepository.RemoveJoinGroupRequest(joinRequest);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Hủy yêu cầu tham gia nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
