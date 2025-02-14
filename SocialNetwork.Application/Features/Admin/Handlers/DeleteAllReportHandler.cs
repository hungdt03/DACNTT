using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class DeleteAllReportHandler : IRequestHandler<DeleteAllReportQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteAllReportHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteAllReportQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.ReportRepository.DeleteAllReport();
   
            return new DataResponse<String>()
            {
                Data = "",
                IsSuccess = true,
                Message = "Xóa tất cả báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
