using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetTop10UserActiveHandler : IRequestHandler<GetTop10UserActiveQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetTop10UserActiveHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetTop10UserActiveQuery request, CancellationToken cancellationToken)
        {
            var users = await unitOfWork.UserRepository.GetAllRoleUser()
                ?? throw new AppException("không có user nào");

            var usersScore = new List<UserScoreCommand>();
            foreach (var user in users)
            {
                var userScore = GetUserScore(user.Id);
                usersScore.Add(new UserScoreCommand(await userScore, ApplicationMapper.MapToUser(user)));
            }
            var top10Users = usersScore.OrderByDescending(us => us.Score)
                                .Take(10)
                                .ToList();
            return new DataResponse<List<ScoreResponse>>()
            {
                Data = ApplicationMapper.MapToUserScore(top10Users),
                IsSuccess = true,
                Message = "Lấy thông tin top 10 user tương tác thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
        private async Task<int> GetUserScore(string userId)
        {
            var countPosts = await unitOfWork.PostRepository.CountPostsByUserIdAsync(userId);
            var countReactions = await unitOfWork.ReactionRepository.CountReactionsByUserIdAsync(userId);
            var countComments = await unitOfWork.CommentRepository.CountCommentsByUserIdAsync(userId);
            var countShares = await unitOfWork.PostRepository.CountSharePostsByUserIdAsync(userId);
            var countStories = await unitOfWork.StoryRepository.CountStoriesByUserIdAsync(userId);

            return countPosts * 5 + (countShares + countReactions) + countComments * 2 + countStories * 3;
        }
    }
}
