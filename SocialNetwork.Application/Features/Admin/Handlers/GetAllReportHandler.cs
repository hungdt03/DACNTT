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
    public class GetAllReportHandler : IRequestHandler<GetAllReportQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllReportHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllReportQuery request, CancellationToken cancellationToken)
        {
            var reports = await unitOfWork.ReportRepository.GetAllReports()
               ?? throw new AppException("Không có report nào");

            return new DataResponse<List<ReportResponse>>()
            {
                Data = ApplicationMapper.MapToListReport(reports),
                IsSuccess = true,
                Message = "Lấy thông tin reports thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
