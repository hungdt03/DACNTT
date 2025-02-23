
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs.Admin;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetGroupByIdHandler : IRequestHandler<GetGroupByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetGroupByIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Nhóm không tồn tại");

            var countPosts = await _unitOfWork.PostRepository
                .CountPostsByGroupIdAsync(group.Id);

            var countTodayPosts = await _unitOfWork.PostRepository
                .CountTodayPostsByGroupIdAsync(group.Id);

            var countAdmins = await _unitOfWork.GroupMemberRepository
                .CountAdminsByGroupIdAsync(group.Id);

            var countModerators = await _unitOfWork.GroupMemberRepository
               .CountModeratorsByGroupIdAsync(group.Id);

            var countMembers = await _unitOfWork.GroupMemberRepository
               .CountGroupMembersByGroupIdAsync(request.GroupId);

            var response = ApplicationMapper.MapToGroupAdmin(group);
            response.CountMembers = countMembers;
            response.CountPosts = countPosts;
            response.ModeratorCount = countModerators;
            response.AdminCount = countAdmins;
            response.CountTodayPosts = countTodayPosts;

            return new DataResponse<GroupAdminResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
