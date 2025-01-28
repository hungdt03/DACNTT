
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetAllGroupsManagerByUserIdHandler : IRequestHandler<GetAllGroupsManagerByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllGroupsManagerByUserIdHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllGroupsManagerByUserIdQuery request, CancellationToken cancellationToken)
        {
            var groups = await unitOfWork.GroupRepository.GetAllGroupsManageByUserId(request.UserId);

            var response = groups.Select(ApplicationMapper.MapToGroup).ToList();

            return new DataResponse<List<GroupResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách nhóm do bạn quản lí thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
