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
            var (groups, totalCount) = await unitOfWork.GroupRepository.GetAllGroupsAsync(request.Page, request.Size, request.Search, request.Privacy);

            return new PaginationResponse<IEnumerable<GroupResponse>>()
            {
                Data = ApplicationMapper.MapToListGroup(groups),
                IsSuccess = true,
                Message = "Lấy thông tin groups thành công",
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
