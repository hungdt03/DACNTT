using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services.Redis;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllUserConnectionHandler : IRequestHandler<GetAllUserConnectionQuery, BaseResponse>
    {
        private readonly IUserStatusService userStatusService;

        public GetAllUserConnectionHandler(IUserStatusService userStatusService)
        {
            this.userStatusService = userStatusService;
        }
        public async Task<BaseResponse> Handle(GetAllUserConnectionQuery request, CancellationToken cancellationToken)
        {
            var numb = await userStatusService.GetAllConnectionsAsync();

            return new DataResponse<int>()
            {
                Data = numb,
                IsSuccess = true,
                Message = "Lấy thông tin tài khoản đang hoạt động thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
