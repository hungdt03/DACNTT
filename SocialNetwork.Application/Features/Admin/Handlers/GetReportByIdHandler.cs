using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;


namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetReportByIdHandler : IRequestHandler<GetReportByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetReportByIdHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetReportByIdQuery request, CancellationToken cancellationToken)
        {
            var report = await unitOfWork.ReportRepository.GetReportByIdAsync(request.reportId)
               ?? throw new AppException("Không có report nào");

            return new DataResponse<ReportResponse>()
            {
                Data = ApplicationMapper.MapToReport(report),
                IsSuccess = true,
                Message = "Lấy thông tin report thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
