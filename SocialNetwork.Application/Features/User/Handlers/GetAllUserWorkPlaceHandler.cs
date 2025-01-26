using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetAllUserWorkPlaceHandler : IRequestHandler<GetAllUserWorkPlaceQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllUserWorkPlaceHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllUserWorkPlaceQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;

            var userWorkPlaces = await _unitOfWork.UserWorkPlaceRepository.GetAllUserWorkPlacesAsync(userId);

            return new DataResponse<List<Domain.Entity.UserInfo.UserWorkPlace>>
            {
                Data = userWorkPlaces,
                IsSuccess = true,
                Message = "Lấy thông tin nơi làm việc của user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
