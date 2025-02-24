

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetAllAdminAccountHandler : IRequestHandler<GetAllAdminAccountQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllAdminAccountHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllAdminAccountQuery request, CancellationToken cancellationToken)
        {
            var (adminAccounts, totalCount) = await _unitOfWork.UserRepository.GetAllRoleAdmin(request.Page, request.Size, request.Search);

            return new PaginationResponse<List<UserResponse>>()
            {
                IsSuccess = true,
                Data = adminAccounts.Select(ApplicationMapper.MapToUser).ToList(),
                Message = "Lấy dữ liệu tài khoản admin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Page = request.Page,
                    Size = request.Size,
                    TotalCount = totalCount,
                    TotalPages = (int) Math.Ceiling((double) totalCount / request.Size)
                }
            };
        }
    }
}
