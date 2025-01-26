

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class DeleteUserWorkPlaceHandler : IRequestHandler<DeleteUserWorkPlaceCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteUserWorkPlaceHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteUserWorkPlaceCommand request, CancellationToken cancellationToken)
        {
            var userWorkPlace = await _unitOfWork.UserWorkPlaceRepository.GetUserWorkPlaceByIdAsync(request.UserWorkPlaceId)
                ?? throw new NotFoundException("Thông tin nơi làm việc không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.UserWorkPlaceRepository.DeleteUserWorkPlace(userWorkPlace);
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
