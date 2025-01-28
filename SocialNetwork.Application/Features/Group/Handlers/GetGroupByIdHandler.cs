using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetGroupByIdHandler : IRequestHandler<GetGroupByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetGroupByIdHandler(IUnitOfWork unitOfWork) {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Không tìm thấy thông tin nhóm");

            var response = ApplicationMapper.MapToGroup(group);

            return new DataResponse<GroupResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
