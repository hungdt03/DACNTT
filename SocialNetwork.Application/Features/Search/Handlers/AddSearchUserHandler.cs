
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Search.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class AddSearchUserHandler : IRequestHandler<AddSearchUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public AddSearchUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }


        public async Task<BaseResponse> Handle(AddSearchUserCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var searchUser = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("Không tìm thấy thông tin user cần search");

            var existedSearchHistory = await _unitOfWork
              .SearchRepository.GetSearchHistoryBySearchUserIdAndUserId(request.UserId, userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (existedSearchHistory != null)
            {
                existedSearchHistory.DateCreated = DateTimeOffset.UtcNow;
            }
            else
            {
                var searchHistory = new SearchHistory()
                {
                    SearchUserId = searchUser.Id,
                    UserId = userId
                };

                await _unitOfWork.SearchRepository.CreateSearchHistoryAsync(searchHistory);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Thêm vào lịch sử tìm kiếm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
