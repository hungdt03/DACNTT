
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllMemberPostByMemberHandler : IRequestHandler<GetAllMemberPostByMemberQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllMemberPostByMemberHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllMemberPostByMemberQuery request, CancellationToken cancellationToken)
        {

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.MemberId)
                ?? throw new AppException("Không tìm thấy thông tin nào");

            var meInGroup = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(member.GroupId, userId);

            if (meInGroup == null && member.Group.Privacy == GroupPrivacy.PRIVATE)
                throw new AppException("Quyền truy cập bị từ chối");

            var (posts, totalCount) = await _unitOfWork.PostRepository
                .GetAllMemberGroupPostsByGroupIdAsync(member.GroupId, member.UserId, request.Page, request.Size);
            
            var response = posts.Select(ApplicationMapper.MapToPost).ToList();
            return new PaginationResponse<List<PostResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bài viết của thành viên trong nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Page = request.Page,
                    Size = request.Size,
                    HasMore = request.Page * request.Size < totalCount,
                }
            };

        }
    }
}
