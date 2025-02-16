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
    public class DeleteManyGroupHandler : IRequestHandler<DeleteManyGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteManyGroupHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteManyGroupQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.GroupRepository.DeletManyGroup(request.listPostId);
   
            return new BaseResponse()
            {
        
                IsSuccess = true,
                Message = "Xóa các nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
