using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllPostHandler : IRequestHandler<GetAllPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllPostHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllPostQuery request, CancellationToken cancellationToken)
        {
            var posts = await unitOfWork.PostRepository.GetAllPostsAsync()
               ?? throw new AppException("Không có post nào");

            return new DataResponse<List<PostResponse>>()
            {
                Data = ApplicationMapper.MapToListPost(posts),
                IsSuccess = true,
                Message = "Lấy thông tin posts thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
