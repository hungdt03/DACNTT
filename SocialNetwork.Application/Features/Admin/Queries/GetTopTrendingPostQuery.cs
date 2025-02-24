
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetTopTrendingPostQuery : IRequest<BaseResponse>
    {
        // Gồm các giá trị 'today', 'yesterday', 'week', 'month', 'range'
        public string? Type { get; set; }
        public DateTimeOffset? From { get; set; }
        public DateTimeOffset? To { get; set; }

        public GetTopTrendingPostQuery(string type, DateTimeOffset? from, DateTimeOffset? to)
        {
            Type = type;
            From = from;
            To = to;
        }
    }
}
