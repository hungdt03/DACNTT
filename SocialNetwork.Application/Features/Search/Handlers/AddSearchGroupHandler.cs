
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
    public class AddSearchGroupHandler : IRequestHandler<AddSearchGroupCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public AddSearchGroupHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
                _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(AddSearchGroupCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var searchGroup = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Không tìm thấy thông tin nhóm cần search");

            var existedSearchHistory = await _unitOfWork
               .SearchRepository.GetSearchHistoryByGroupIdAndUserId(request.GroupId, userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (existedSearchHistory != null)
            {
                existedSearchHistory.DateCreated = DateTimeOffset.UtcNow;
            }
            else
            {
                var searchHistory = new SearchHistory()
                {
                    SearchGroupId = searchGroup.Id,
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
