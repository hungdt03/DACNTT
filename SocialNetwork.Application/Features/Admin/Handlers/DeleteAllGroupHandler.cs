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
    public class DeleteAllGroupHandler : IRequestHandler<DeleteAllGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteAllGroupHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteAllGroupQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.GroupRepository.DeleteAllGroup();
   
            return new DataResponse<String>()
            {
                Data = "",
                IsSuccess = true,
                Message = "Xóa tất cả nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
