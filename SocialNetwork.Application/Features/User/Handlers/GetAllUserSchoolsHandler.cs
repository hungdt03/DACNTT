
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetAllUserSchoolsHandler : IRequestHandler<GetAllUserSchoolQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllUserSchoolsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllUserSchoolQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;

            var userSchools = await _unitOfWork.UserSchoolRepository.GetAllUserSchoolsAsync(userId);

            return new DataResponse<List<Domain.Entity.UserInfo.UserSchool>>
            {
                Data = userSchools,
                IsSuccess = true,
                Message = "Lấy thông tin học vấn của user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
