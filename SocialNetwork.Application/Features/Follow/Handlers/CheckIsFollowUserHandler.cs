
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Follow.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Follow.Handlers
{
    public class CheckIsFollowUserHandler : IRequestHandler<CheckFollowUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CheckIsFollowUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CheckFollowUserQuery request, CancellationToken cancellationToken)
        {
            var followerId = _contextAccessor.HttpContext.User.GetUserId();
            var follow = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(followerId, request.FolloweeId)
                ?? throw new NotFoundException("Bạn chưa theo dõi người này");

            return new DataResponse<bool>
            {
                Data = true,
                IsSuccess = true,
                Message = "Bạn đã theo dõi người này",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
