

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class CancelInviteFriendHandler : IRequestHandler<CancelInviteFriendCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CancelInviteFriendHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(CancelInviteFriendCommand request, CancellationToken cancellationToken)
        {
            var invitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByIdAsync(request.InviteId);

            if (invitation == null || invitation.Status == true)
                throw new NotFoundException("Lời mời không tồn tại hoặc không còn nữa");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (invitation.InviterId != userId)
                throw new AppException("Bạn không có quyền hủy bỏ lời mời này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupInvitationRepository.RemoveGroupInvitation(invitation);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Hủy bỏ lời mời thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
