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
    public class DeleteAllPostHandler : IRequestHandler<DeleteAllPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public DeleteAllPostHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteAllPostQuery request, CancellationToken cancellationToken)
        {
            await unitOfWork.PostRepository.DeleteAllPost();
   
            return new DataResponse<String>()
            {
                Data = "",
                IsSuccess = true,
                Message = "Xóa tất cả bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
