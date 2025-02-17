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
    public class CountAllPostHandler : IRequestHandler<CountAllPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public CountAllPostHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(CountAllPostQuery request, CancellationToken cancellationToken)
        {
            var numb = await unitOfWork.PostRepository.CountAllPost();
            return new DataResponse<int>()
            {
                Data = numb,
                IsSuccess = true,
                Message = "Lấy thông tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
