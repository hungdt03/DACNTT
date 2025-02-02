
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.DTOs.Search;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchGroupHandler : IRequestHandler<SearchGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public SearchGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(SearchGroupQuery request, CancellationToken cancellationToken)
        {
            var (groups, totalCount) = await _unitOfWork.GroupRepository.GetAllGroupsContainsKey(request.Query.ToLower(), request.Page, request.Size);

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var myFriendsIds = myFriends.Select(f => f.UserId == userId ? f.FriendId : f.UserId).ToHashSet();
            var response = new List<SearchGroupSuggestResponse>();

            foreach(var group in groups)
            {
                var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(group.Id, userId);

                if (groupMember == null && group.IsHidden && group.Privacy == GroupPrivacy.PRIVATE) continue;

                var countMemberFriends = group.Members.Where(grm => myFriendsIds.Contains(grm.UserId)).Count();
                var mapGroup = ApplicationMapper.MapToGroup(group);
                var members = group.Members.Where(grm => myFriendsIds.Contains(grm.UserId)).Take(3);

                var item = new SearchGroupSuggestResponse()
                {
                    TotalMembers = group.Members.Count,
                    CountFriendMembers = countMemberFriends,
                    FriendMembers = members.Select(m => ApplicationMapper.MapToUser(m.User)).ToList(),
                    IsMember = groupMember != null,
                    Group = mapGroup,
                };

                response.Add(item);
            }
            
            var countGroups = response.Count;

            return new PaginationResponse<List<SearchGroupSuggestResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {countGroups} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size <= totalCount
                }
            };
        }
    }
}
