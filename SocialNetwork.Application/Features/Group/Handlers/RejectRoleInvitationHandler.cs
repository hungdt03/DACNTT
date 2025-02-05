
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class RejectRoleInvitationHandler : IRequestHandler<RejectRoleInvitationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RejectRoleInvitationHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RejectRoleInvitationCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var invitation = await _unitOfWork.GroupRoleInvitationRepository
                .GetByIdAsync(request.InvitationId)
                    ?? throw new NotFoundException("Lời mời không tồn tại");

            if (invitation.InviteeId != userId)
                throw new AppException("Bạn không phải là người được mời");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupRoleInvitationRepository.RemoveRoleInvitation(invitation);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã từ chối lời mời",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
