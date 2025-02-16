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
    public class DeleteManyPostHandler : IRequestHandler<DeleteManyPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteManyPostHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteManyPostQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.PostRepository.DeleteManyPost(request.listPostId);
   
            return new BaseResponse()
            {
           
                IsSuccess = true,
                Message = "Xóa các bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
