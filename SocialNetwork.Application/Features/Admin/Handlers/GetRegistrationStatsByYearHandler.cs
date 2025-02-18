using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetRegistrationStatsByYearHandler : IRequestHandler<GetRegistrationStatsByYearsQuery , BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetRegistrationStatsByYearHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetRegistrationStatsByYearsQuery request, CancellationToken cancellationToken)
        {
            var years = await unitOfWork.UserRepository.GetRegistrationStatsByYear(request.year)
               ?? throw new AppException("Không có năm nào");

            return new DataResponse<List<MonthlyRegistrationStatsResponse>>()
            {
                Data = years,
                IsSuccess = true,
                Message = "Lấy thông tin posts thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
