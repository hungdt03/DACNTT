using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetUserByIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(request.UserId)
                ?? throw new NotFoundException("Không tìm thấy dữ liệu người dùng");

            return new DataResponse<UserResponse>
            {
                Data = ApplicationMapper.MapToUser(user),
                IsSuccess = true,
                Message = "Lấy dữ liệu user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
