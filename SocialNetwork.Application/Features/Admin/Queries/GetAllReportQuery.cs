using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllReportQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }

        public GetAllReportQuery(int page, int size, string status, string type)
        {
            Page = page;
            Size = size;
            Status = status;
            Type = type;
        }
    }
}
