
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class UpdateUserEducationHandler : IRequestHandler<UpdateUserEducationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserEducationHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(UpdateUserEducationCommand request, CancellationToken cancellationToken)
        {
            var userSchool = await _unitOfWork.UserSchoolRepository.GetUserSchoolsByIdAsync(request.UserSchoolId)
                ?? throw new NotFoundException("Thông tin học vấn không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            if(request.UserSchool.SchoolId.HasValue)
            {
                var school = await _unitOfWork.SchoolRepository.GetSchoolByIdAsync(request.UserSchool.SchoolId.Value)
                    ?? throw new NotFoundException("Thông tin trường học không tồn tại");

                userSchool.SchoolId = school.Id;
            } else
            {
                var checkExistedSchool = await _unitOfWork.SchoolRepository.GetSchoolByNameAsync(request.UserSchool.School);
                
                if(checkExistedSchool != null)
                {
                    userSchool.SchoolId = checkExistedSchool.Id;
                } else
                {
                    var newSchool = new Domain.Entity.System.School();
                    newSchool.Name = request.UserSchool.School;

                    await _unitOfWork.SchoolRepository.CreateSchoolAsync(newSchool);
                    userSchool.SchoolId = newSchool.Id;
                }
               
            }
            
            if (request.UserSchool.Major != null && request.UserSchool.MajorId.HasValue)
            {
                var major = await _unitOfWork.MajorRepository.GetMajorByIdAsync(request.UserSchool.MajorId.Value)
                    ?? throw new NotFoundException("Thông tin ngành học không tồn tại");

                userSchool.MajorId = major.Id;
            }
            else
            {
                var checkExistedMajor = await _unitOfWork.MajorRepository.GetMajorByNameAsync(request.UserSchool.Major);

                if (checkExistedMajor != null)
                {
                    userSchool.MajorId = checkExistedMajor.Id;
                }
                else
                {
                    var newMajor = new Domain.Entity.System.Major();
                    newMajor.Name = request.UserSchool.Major;

                    await _unitOfWork.MajorRepository.CreateNewMajorAsync(newMajor);
                    userSchool.MajorId = newMajor.Id;
                }

            }

            userSchool.Status = request.UserSchool.IsGraduated ? EducationStatus.GRADUATED : EducationStatus.STUDYING;
            if(!request.UserSchool.IsGraduated) {
                userSchool.StartYear = request.UserSchool.StartYear;
            }
            
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                Message = "Cập nhật thông tin học vấn thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
