
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.FriendRequest.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.FriendRequest.Handlers
{
    public class GetFriendSuggestionHandler : IRequestHandler<GetFriendSuggestionsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public GetFriendSuggestionHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }
        public async Task<BaseResponse> Handle(GetFriendSuggestionsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var me = await _unitOfWork.UserRepository.GetUserByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            var allUsers = await _unitOfWork.UserRepository.GetAllUsers();

            var dictUsers = new Dictionary<Domain.Entity.System.User, (int, List<Domain.Entity.System.User>)>();
            
            foreach(var user in allUsers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles != null && roles.Count > 0 && roles[0] == "ADMIN") continue;

                if(userId == user.Id) continue;
                var friendShip = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, user.Id);

                if (friendShip != null) continue;

                var blockUser = await _unitOfWork.BlockListRepository.GetBlockListByBlockeeIdAndBlockerIdAsync(userId, user.Id);
                var reverseBlock = await _unitOfWork.BlockListRepository.GetBlockListByBlockeeIdAndBlockerIdAsync(user.Id, userId);
                
                if(blockUser != null || reverseBlock != null) continue;

                var (mutualFriends, score) = await CalculateFriendScore(me, user);
                dictUsers.Add(user, (score, mutualFriends));
            }

            var suggestedUsers = dictUsers.Keys
                .Where(x => dictUsers[x].Item1 > 0)
                .OrderByDescending(x => dictUsers[x].Item1)
                .Skip((request.Page - 1) * request.Size)
                .Take(request.Size)
                .Select(x =>
                {
                    var mapUser = ApplicationMapper.MapToUser(x);
                    var mutualFriends = dictUsers[x].Item2.Select(ApplicationMapper.MapToUser).ToList();

                    return new SuggestUserResponse()
                    {
                        MutualFriends = mutualFriends,
                        User = mapUser
                    };
                }).ToList();


            return new PaginationResponse<List<SuggestUserResponse>>()
            {
                Data = suggestedUsers,
                IsSuccess = true,
                Message = "Lấy dữ liệu gợi ý kết bạn thành công",
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size < suggestedUsers.Count
                }
            };
        }

        private async Task<(List<Domain.Entity.System.User> MutualFriends, int score)> CalculateFriendScore(Domain.Entity.System.User me, Domain.Entity.System.User candidate)
        {
            var score = 0;

            var newUserThreshold = DateTime.UtcNow.AddDays(-30); // Người đăng ký trong vòng 30 ngày gần nhất
            bool isMeNewUser = me.DateJoined >= newUserThreshold;
            bool isCandidateNewUser = candidate.DateJoined >= newUserThreshold;

            if (isMeNewUser && isCandidateNewUser)
            {
                score += 15;
            }
            else if (isCandidateNewUser)
            {
                score += 10;
            }

            // Mutual Friends
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(me.Id, FriendShipStatus.ACCEPTED);

            var candidateFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(candidate.Id, FriendShipStatus.ACCEPTED);
            var candidateFriendIds = candidateFriends.Select(f => f.FriendId != candidate.Id ? f.FriendId : f.UserId).ToHashSet();

            var mutualFriends = myFriends.Where(m => candidateFriendIds.Any(f => f == (m.FriendId != me.Id ? m.FriendId : m.UserId))).Select(m => m.FriendId != me.Id ? m.Friend : m.User).ToList();
            score = mutualFriends.Count * 5;

            if(me.HometownId == candidate.HometownId)
            {
                score += 3;
            }

            if (me.LocationId == candidate.LocationId)
            {
                score += 4;
            }

            var mySchools = await _unitOfWork.UserSchoolRepository.GetAllUserSchoolsAsync(me.Id);
            var mySchoolIds = mySchools.Select(m => m.SchoolId).ToHashSet();

            var candidateSchools = await _unitOfWork.UserSchoolRepository.GetAllUserSchoolsAsync(candidate.Id);
            var candidateSchoolIds = mySchools.Select(m => m.SchoolId).ToHashSet();

            var sameSchools = mySchoolIds.Count(m => candidateSchoolIds.Contains(m));
            score += sameSchools * 2;

            var myWorkPlaces = await _unitOfWork.UserWorkPlaceRepository.GetAllUserWorkPlacesAsync(me.Id);
            var myWorkPlaceIds = myWorkPlaces.Select(m => m.CompanyId).ToHashSet();

            var candidateWorkPlaces = await _unitOfWork.UserWorkPlaceRepository.GetAllUserWorkPlacesAsync(candidate.Id);
            var candidateWorkPlaceIds = candidateWorkPlaces.Select(m => m.CompanyId).ToHashSet();

            var sameWorkPlaces = myWorkPlaceIds.Count(m => candidateWorkPlaceIds.Contains(m));
            score += sameWorkPlaces * 3;

            if (isMeNewUser)
            {
                score += await GetActiveUserScore(candidate.Id);
            }

            return (mutualFriends, score);
        }

        private async Task<int> GetActiveUserScore(string candidateId)
        {
            var countPosts = await _unitOfWork.PostRepository.CountPostsByUserIdAsync(candidateId);
            var countReactions = await _unitOfWork.ReactionRepository.CountReactionsByUserIdAsync(candidateId);
            var countComments = await _unitOfWork.CommentRepository.CountCommentsByUserIdAsync(candidateId);
            var countShares = await _unitOfWork.PostRepository.CountSharePostsByUserIdAsync(candidateId);
            var countStories = await _unitOfWork.StoryRepository.CountStoriesByUserIdAsync(candidateId);

            return countPosts * 5 + (countShares + countReactions) + countComments * 2 + countStories * 3;
        }
    }
}
