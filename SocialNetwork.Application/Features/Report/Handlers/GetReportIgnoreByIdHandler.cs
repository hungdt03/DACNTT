
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Report.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class GetReportIgnoreByIdHandler : IRequestHandler<GetReportIgnoreByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetReportIgnoreByIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetReportIgnoreByIdQuery request, CancellationToken cancellationToken)
        {
            var report = await _unitOfWork.ReportRepository
                .GetReportByIdAsync(request.ReportId)
                    ?? throw new NotFoundException("Không tìm thấy báo cáo nào phù hợp");

            return new DataResponse<ReportResponse>
            {
                Data = ApplicationMapper.MapToReport(report),
                IsSuccess = true,
                Message = "Lấy thông tin báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
