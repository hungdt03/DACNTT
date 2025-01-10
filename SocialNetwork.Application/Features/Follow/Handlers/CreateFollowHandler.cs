

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Follow.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Follow.Handlers
{
    public class CreateFollowHandler : IRequestHandler<CreateFollowCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.User> _userManager;

        public CreateFollowHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(CreateFollowCommand request, CancellationToken cancellationToken)
        {

            var followee = await _userManager.FindByIdAsync(request.FolloweeId)
                ?? throw new NotFoundException("Không tìm thấy thông tin người được theo dõi");

            var followerId = _contextAccessor.HttpContext.User.GetUserId();

            Domain.Entity.Follow follow = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(followerId, request.FolloweeId);
            if (follow != null) throw new AppException("Bạn đã theo dõi người này");
               

            follow = new Domain.Entity.Follow()
            {
                FolloweeId = request.FolloweeId,
                FollowerId = followerId,
                Status = "FOLLOWING"
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.FollowRepository.CreateFollowAsync(follow);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Đã theo dõi người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
