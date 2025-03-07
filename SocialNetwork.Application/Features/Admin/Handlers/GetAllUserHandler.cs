﻿using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllUserHandler : IRequestHandler<GetAllUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllUserHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
        {
            var (users, totalCount) = await unitOfWork.UserRepository.GetAllRoleUser(request.Page, request.Size, request.Search);

            return new PaginationResponse<List<UserResponse>>()
            {
                Data = ApplicationMapper.MapToListUser(users),
                IsSuccess = true,
                Message = "Lấy thông tin users thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Page = request.Page,
                    Size = request.Size,
                    HasMore = request.Page * request.Size < totalCount,
                    TotalCount = totalCount,
                    TotalPages = (int) Math.Ceiling((double) totalCount / request.Size)
                }
            };
        }
    }
}
