
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class DeleteUserSchoolHandler : IRequestHandler<DeleteUserSchoolCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteUserSchoolHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(DeleteUserSchoolCommand request, CancellationToken cancellationToken)
        {
            var userSchool = await _unitOfWork.UserSchoolRepository.GetUserSchoolsByIdAsync(request.UserSchoolId)
                ?? throw new NotFoundException("Thông tin học vấn không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.UserSchoolRepository.DeleteUserSchool(userSchool);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa thông tin học vấn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
