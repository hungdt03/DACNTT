

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs.Admin;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetTopTrendingPostsHandler : IRequestHandler<GetTopTrendingPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetTopTrendingPostsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetTopTrendingPostQuery request, CancellationToken cancellationToken)
        {
            DateTimeOffset? from = null;
            DateTimeOffset? to = DateTimeOffset.UtcNow; // Luôn lấy đến thời điểm hiện tại

            if (request.Type == "today")
            {
                from = DateTimeOffset.UtcNow.Date; // Từ 00:00 UTC hôm nay
            }
            else if (request.Type == "yesterday")
            {
                from = DateTimeOffset.UtcNow.Date.AddDays(-1); // 00:00 UTC hôm qua
                to = DateTimeOffset.UtcNow.Date; // 00:00 UTC hôm nay
            }
            else if (request.Type == "week")
            {
                from = DateTimeOffset.UtcNow.Date.AddDays(-6); // Lùi lại đúng 6 ngày trước (tổng cộng đủ 7 ngày)
            }
            else if (request.Type == "month")
            {
                from = new DateTimeOffset(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, TimeSpan.Zero); // Đầu tháng
            }
            else if (request.Type == "range")
            {
                if (request.From.HasValue && request.To.HasValue)
                {
                    from = request.From.Value;
                    to = request.To.Value;
                }
                else if (request.From.HasValue) // Nếu chỉ có From, lấy từ đó đến hiện tại
                {
                    from = request.From.Value;
                    to = DateTimeOffset.UtcNow;
                }
                else if (request.To.HasValue) // Nếu chỉ có To, lấy từ trước đó đến To
                {
                    from = null; // Lấy tất cả trước đó
                    to = request.To.Value;
                }
            }

            var top5TrendingPosts = await _unitOfWork.PostRepository
                .GetTopTrendingPosts(from, to);

            return new DataResponse<List<TrendingPost>>()
            {
                Data = top5TrendingPosts,
                IsSuccess = true,
                Message = "Lấy dữ liệu bài viết có tương tác nhiều nhất",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

    }
}
