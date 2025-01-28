

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllGroupsJoinByUserIdHandler : IRequestHandler<GetAllGroupsJoinByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllGroupsJoinByUserIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllGroupsJoinByUserIdQuery request, CancellationToken cancellationToken)
        {
            var groups = await _unitOfWork.GroupRepository.GetAllGroupsJoinByUserId(request.UserId);
            var response = groups.Select(ApplicationMapper.MapToGroup).ToList();

            return new DataResponse<List<GroupResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách nhóm mà bạn đã tham gia thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
