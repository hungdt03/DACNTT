
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Major.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Major.Handlers
{
    public class SearchMajorContainsNameHandler : IRequestHandler<SearchMajorContainsNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchMajorContainsNameHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(SearchMajorContainsNameQuery request, CancellationToken cancellationToken)
        {
            var major = await _unitOfWork.MajorRepository.GetMajorsContainsName(request.Name);

            return new DataResponse<List<Domain.Entity.System.Major>>
            {
                Data = major.ToList(),
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Tìm kiếm thông tin ngành học thành công"
            };
        }
    }
}
