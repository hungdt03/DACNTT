
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Position.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Position.Handlers
{
    public class SearchPositionsContainsNameHandler : IRequestHandler<SearchPositionsContainsNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchPositionsContainsNameHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(SearchPositionsContainsNameQuery request, CancellationToken cancellationToken)
        {
            var positions = await _unitOfWork.PositionRepository.GetPositionsContainsNameAsync(request.Name);

            return new DataResponse<List<Domain.Entity.System.Position>>
            {
                Data = positions.ToList(),
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Tìm kiếm thông tin ngành học thành công"
            };
        }
    }
}
