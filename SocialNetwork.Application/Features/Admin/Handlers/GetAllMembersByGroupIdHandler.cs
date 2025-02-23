
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllMembersByGroupIdHandler : IRequestHandler<GetAllMembersByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllMembersByGroupIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllMembersByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var (groupMembers, totalCount) = await _unitOfWork.GroupMemberRepository.GetAllMembersInGroupAsync(request.GroupId, request.Page, request.Size, request.Search, request.Role);

            return new PaginationResponse<List<GroupMemberResponse>>()
            {
                Data = groupMembers.Select(ApplicationMapper.MapToGroupMember).ToList(),
                IsSuccess = true,
                Message = "Lấy tất cả thành viên của nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Size * request.Page < totalCount,
                    TotalCount = totalCount,
                    TotalPages = (int) Math.Ceiling((double) totalCount / request.Size),
                }
            };
        }
    }
}
