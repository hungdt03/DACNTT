

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class ModifyUserEducationHandler : IRequestHandler<ModifyUserEducationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public ModifyUserEducationHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            this._unitOfWork = unitOfWork;
            this._contextAccessor = contextAccessor;
            this._userManager = userManager;
        }

        public async Task<BaseResponse> Handle(ModifyUserEducationCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);

            var school = await _unitOfWork.SchoolRepository.GetSchoolByNameAsync(request.School)
                ?? new Domain.Entity.System.School { Name = request.School };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            if (school.Id == Guid.Empty)
            {
                await _unitOfWork.SchoolRepository.CreateSchoolAsync(school);
            }

            var userSchool = new Domain.Entity.UserInfo.UserSchool
            {
                SchoolId = school.Id,
                StartDate = DateTimeOffset.UtcNow,
                UserId = userId,
                Status = request.IsGraduated ? EducationStatus.GRADUATED : EducationStatus.STUDYING
            };

            await _unitOfWork.UserSchoolRepository.CreateUserSchoolAsync(userSchool);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật thông tin học vấn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
