

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class GetGroupVideosHandler : IRequestHandler<GetGroupVideosQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetGroupVideosHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(GetGroupVideosQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                    ?? throw new NotFoundException("Nhóm không tồn tại");

            var groupMember = await _unitOfWork.GroupMemberRepository
               .GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (group.Privacy == GroupPrivacy.PRIVATE && groupMember == null)
                throw new AppException("Bạn không có quyền lấy dữ liệu ảnh trong nhóm");

            var (videos, totalCount) = await _unitOfWork.PostMediaRepository.GetAllGroupVideosByGroupId(request.GroupId, request.Page, request.Size);

            var response = videos.Select(ApplicationMapper.MapToPostMedia).ToList();

            return new PaginationResponse<List<MediaResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy dữ liệu video của nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                }
            };
        }
    }
}
