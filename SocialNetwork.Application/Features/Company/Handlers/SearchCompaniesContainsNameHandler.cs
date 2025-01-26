
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Company.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Company.Handlers
{
    public class SearchCompaniesContainsNameHandler : IRequestHandler<SearchCompaniesContainsNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchCompaniesContainsNameHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(SearchCompaniesContainsNameQuery request, CancellationToken cancellationToken)
        {
            var companies = await _unitOfWork.CompanyRepository.GetCompaniesContainsNameAsync(request.Name);

            return new DataResponse<List<Domain.Entity.System.Company>>
            {
                Data = companies.ToList(),
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Tìm kiếm thông tin ngành học thành công"
            };
        }
    }
}
