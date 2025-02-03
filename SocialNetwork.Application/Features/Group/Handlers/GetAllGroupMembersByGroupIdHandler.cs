
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllGroupMembersByGroupIdHandler : IRequestHandler<GetAllMembersByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllGroupMembersByGroupIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllMembersByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var groupMembers = await _unitOfWork.GroupMemberRepository.GetAllMembersInGroupAsync(request.GroupId);
            var response = groupMembers.Select(ApplicationMapper.MapToGroupMember).ToList();

            return new DataResponse<List<GroupMemberResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy tất cả thành viên của nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
