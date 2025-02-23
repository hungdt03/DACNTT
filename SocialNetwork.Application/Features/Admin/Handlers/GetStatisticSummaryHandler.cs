
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.DTOs.Admin;
using SocialNetwork.Application.DTOs.Score;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using System.Linq;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetStatisticSummaryHandler : IRequestHandler<GetStatisticSummaryQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserStatusService _userStatusService;

        public GetStatisticSummaryHandler(IUnitOfWork unitOfWork, IUserStatusService userStatusService)
        {
            _unitOfWork = unitOfWork;
            _userStatusService = userStatusService;
        }
        public async Task<BaseResponse> Handle(GetStatisticSummaryQuery request, CancellationToken cancellationToken)
        {
            var countGroups = await _unitOfWork.GroupRepository.CountAllGroup();
            var countPosts = await _unitOfWork.PostRepository.CountAllPost();
            var countUsers = await _unitOfWork.UserRepository.CountAllUser();
            var connections = await _userStatusService.GetAllConnectionsAsync();
            var countOnlineUsers = await _unitOfWork.UserRepository.CountOnlineUsersAsync();
            var countOfflineUsers = await _unitOfWork.UserRepository.CountOfflineUsersAsync();
            var countReports = await _unitOfWork.ReportRepository.CountAllReport();

            // Top 10 user tương tác nhiều nhất
            var users = await _unitOfWork.UserRepository.GetAllRoleUser();
            var usersScore = new List<UserScore>();
            foreach (var user in users)
            {
                var userScore = GetUserScore(user.Id);
                usersScore.Add(new UserScore(await userScore, ApplicationMapper.MapToUser(user)));
            }
            var top10Users = usersScore.OrderByDescending(us => us.Score)
                                .Take(10)
                                .ToList();

            var top5Followers = await _unitOfWork.UserRepository.GetTop5UserFollowers();

            var response = new StatisticResponse()
            {
                CountConnections = connections,
                CountGroups = countGroups,
                CountPosts = countPosts,
                CountUsers = countUsers,
                CountOfflineUsers = countOfflineUsers,
                CountOnlineUsers = countOnlineUsers,
                CountReports = countReports,
                Top10UserScores = top10Users,
                Top5Followers = top5Followers,
            };

            return new DataResponse<StatisticResponse>()
            {
                IsSuccess = true,
                Data = response,
                Message = "Lấy thông tin thống kê thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        private async Task<int> GetUserScore(string userId)
        {
            var countPosts = await _unitOfWork.PostRepository.CountPostsByUserIdAsync(userId);
            var countReactions = await _unitOfWork.ReactionRepository.CountReactionsByUserIdAsync(userId);
            var countComments = await _unitOfWork.CommentRepository.CountCommentsByUserIdAsync(userId);
            var countShares = await _unitOfWork.PostRepository.CountSharePostsByUserIdAsync(userId);
            var countStories = await _unitOfWork.StoryRepository.CountStoriesByUserIdAsync(userId);

            return countPosts * 5 + (countShares + countReactions) + countComments * 2 + countStories * 3;
        }
    }
}
