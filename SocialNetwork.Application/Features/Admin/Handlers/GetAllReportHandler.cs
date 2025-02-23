using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

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
            var (reports, totalCount) = await unitOfWork.ReportRepository.GetAllReportsIgnore(request.Page, request.Size, request.Status, request.Type);

            return new PaginationResponse<List<ReportResponse>>()
            {
                Data = ApplicationMapper.MapToListReport(reports),
                IsSuccess = true,
                Message = "Lấy thông tin reports thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Page = request.Page,
                    Size = request.Size,
                    HasMore = request.Page * request.Size < totalCount,
                    TotalCount = totalCount,
                    TotalPages = (int) Math.Ceiling((double) totalCount / request.Size),
                }
            };
        }
    }
}
