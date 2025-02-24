using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;


namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetRegistrationYearsHandler : IRequestHandler<GetRegistrationYearsQuery , BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetRegistrationYearsHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetRegistrationYearsQuery request, CancellationToken cancellationToken)
        {
            var years = await unitOfWork.UserRepository.GetRegistrationYears();

            return new DataResponse<List<int>>()
            {
                Data = years,
                IsSuccess = true,
                Message = "Lấy thông tin posts thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
