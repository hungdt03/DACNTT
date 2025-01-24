
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
    public class UnfollowUserHandler : IRequestHandler<UnfollowUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public UnfollowUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(UnfollowUserCommand request, CancellationToken cancellationToken)
        {
            var follower = await _userManager.FindByIdAsync(request.FolloweeId)
                ?? throw new NotFoundException("Thông tin người được theo dõi không tồn tại");

            var followerId = _contextAccessor.HttpContext.User.GetUserId();

            var follow = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(followerId, request.FolloweeId)
                ?? throw new NotFoundException("Bạn chưa theo dõi người này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.FollowRepository.DeleteFollow(follow);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bỏ theo dõi người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
