

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class AddUserEducationHandler : IRequestHandler<AddUserEducationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public AddUserEducationHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            this._unitOfWork = unitOfWork;
            this._contextAccessor = contextAccessor;
            this._userManager = userManager;
        }

        public async Task<BaseResponse> Handle(AddUserEducationCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);
            
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var userSchool = new Domain.Entity.UserInfo.UserSchool
            {
                UserId = userId,
                Status = request.IsGraduated ? EducationStatus.GRADUATED : EducationStatus.STUDYING
            };

            if (!request.IsGraduated)
            {
                userSchool.StartYear = request.StartYear;
            }

            if (request.SchoolId != null)
            {
                var school = await _unitOfWork.SchoolRepository.GetSchoolByIdAsync(request.SchoolId.Value)
                    ?? throw new NotFoundException("Thông tin trường học không tồn tại");

                userSchool.SchoolId = school.Id;
            }
            else
            {
                var checkExistedSchool = await _unitOfWork.SchoolRepository.GetSchoolByNameAsync(request.School);

                if (checkExistedSchool != null)
                {
                    userSchool.SchoolId = checkExistedSchool.Id;
                }
                else
                {
                    var newSchool = new Domain.Entity.System.School();
                    newSchool.Name = request.School;

                    await _unitOfWork.SchoolRepository.CreateSchoolAsync(newSchool);
                    userSchool.SchoolId = newSchool.Id;
                }

            }

            if (request.MajorId != null && request.MajorId.HasValue)
            {
                var major = await _unitOfWork.MajorRepository.GetMajorByIdAsync(request.MajorId.Value)
                    ?? throw new NotFoundException("Thông tin ngành học không tồn tại");

                userSchool.MajorId = major.Id;
            }
            else
            {
                var checkExistedMajor = await _unitOfWork.MajorRepository.GetMajorByNameAsync(request.Major);

                if (checkExistedMajor != null)
                {
                    userSchool.MajorId = checkExistedMajor.Id;
                }
                else
                {
                    var newMajor = new Domain.Entity.System.Major();
                    newMajor.Name = request.Major;

                    await _unitOfWork.MajorRepository.CreateNewMajorAsync(newMajor);
                    userSchool.MajorId = newMajor.Id;
                }

            }

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
