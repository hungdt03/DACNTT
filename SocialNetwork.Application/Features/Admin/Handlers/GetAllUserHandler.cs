using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllUserHandler : IRequestHandler<GetAllUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllUserHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
        {
            var users = await unitOfWork.UserRepository.GetAllUsers()
               ?? throw new AppException("Không có user nào");

            return new DataResponse<List<UserResponse>>()
            {
                Data = ApplicationMapper.MapToListUser(users),
                IsSuccess = true,
                Message = "Lấy thông tin users thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
