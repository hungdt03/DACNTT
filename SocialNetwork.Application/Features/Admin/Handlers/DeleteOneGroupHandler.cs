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
    public class DeleteOneGroupHandler : IRequestHandler<DeleteOneGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteOneGroupHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteOneGroupQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.GroupRepository.DeleteOneGroup(request.id);
   
            return new BaseResponse()
            {
               
                IsSuccess = true,
                Message = "Xóa nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
