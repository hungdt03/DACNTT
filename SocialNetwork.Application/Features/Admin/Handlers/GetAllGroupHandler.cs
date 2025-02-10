using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllGroupHandler : IRequestHandler<GetAllGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllGroupHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllGroupQuery request, CancellationToken cancellationToken)
        {
            var groups = await unitOfWork.GroupRepository.GetAllGroupsAsync()
               ?? throw new AppException("Không có group nào");

            return new DataResponse<IEnumerable<GroupResponse>>()
            {
                Data = ApplicationMapper.MapToListGroup(groups),
                IsSuccess = true,
                Message = "Lấy thông tin groups thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
