
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Location.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Location.Handlers
{
    public class SearchLocationsContainsNameHandler : IRequestHandler<SearchLocationsContainsNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchLocationsContainsNameHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(SearchLocationsContainsNameQuery request, CancellationToken cancellationToken)
        {
            var locations = await _unitOfWork.LocationRepository.GetLocationsContainsName(request.Name);

            return new DataResponse<ICollection<Domain.Entity.System.Location>>
            {
                Data = locations,
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Tìm kiếm thông tin địa điểm thành công"
            };
        }
    }
}
