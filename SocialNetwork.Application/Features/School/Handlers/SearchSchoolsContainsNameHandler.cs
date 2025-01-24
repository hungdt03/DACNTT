using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.School.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.School.Handlers
{
    public class SearchSchoolsContainsNameHandler : IRequestHandler<SearchSchoolsContainsNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchSchoolsContainsNameHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(SearchSchoolsContainsNameQuery request, CancellationToken cancellationToken)
        {
            var schools = await _unitOfWork.SchoolRepository.GetSchoolsContainsNameAsync(request.Name);

            return new DataResponse<List<Domain.Entity.System.School>>
            {
                Data = schools.ToList(),
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Tìm kiếm thông tin trường học thành công"
            };
        }
    }
}
