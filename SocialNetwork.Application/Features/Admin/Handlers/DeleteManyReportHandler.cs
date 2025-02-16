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
    public class DeleteManyReportHandler : IRequestHandler<DeleteManyReportQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteManyReportHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteManyReportQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.ReportRepository.DeleteManyReport(request.listReportId);
   
            return new BaseResponse()
            {
        
                IsSuccess = true,
                Message = "Xóa các báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
