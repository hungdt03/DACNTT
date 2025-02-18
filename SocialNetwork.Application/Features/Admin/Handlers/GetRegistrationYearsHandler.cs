using MediatR;
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
    public class GetRegistrationYearsHandler : IRequestHandler<GetRegistrationYearsQuery , BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetRegistrationYearsHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetRegistrationYearsQuery request, CancellationToken cancellationToken)
        {
            var years = await unitOfWork.UserRepository.GetRegistrationYears()
               ?? throw new AppException("Không có năm nào");

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
