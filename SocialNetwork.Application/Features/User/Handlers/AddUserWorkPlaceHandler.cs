

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class AddUserWorkPlaceHandler : IRequestHandler<AddUserWorkPlaceCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public AddUserWorkPlaceHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(AddUserWorkPlaceCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var userWorkPlace = new Domain.Entity.UserInfo.UserWorkPlace
            {
                UserId = userId,
                IsCurrent = request.IsCurrent
            };

            if (request.IsCurrent && request.StartYear.HasValue)
            {
                userWorkPlace.StartYear = request.StartYear.Value;
            }

            if (request.CompanyId != null && request.CompanyId.HasValue)
            {
                var company = await _unitOfWork.CompanyRepository.GetCompanyByIdAsync(request.CompanyId.Value)
                    ?? throw new NotFoundException("Thông tin công ty/doanh nghiệp/tổ chức không tồn tại");

                userWorkPlace.CompanyId = company.Id;
            }
            else
            {
                var checkExistedCompany = await _unitOfWork.CompanyRepository.GetCompanyByNameAsync(request.Company);

                if (checkExistedCompany != null)
                {
                    userWorkPlace.CompanyId = checkExistedCompany.Id;
                }
                else
                {
                    var newCompany = new Domain.Entity.System.Company();
                    newCompany.Name = request.Company;

                    await _unitOfWork.CompanyRepository.CreateCompanyAsync(newCompany);
                    userWorkPlace.CompanyId = newCompany.Id;
                }

            }

            if (request.PositionId != null && request.PositionId.HasValue)
            {
                var position = await _unitOfWork.PositionRepository.GetPositionByIdAsync(request.PositionId.Value)
                    ?? throw new NotFoundException("Thông tin ví trí việc làm không tồn tại");

                userWorkPlace.PositionId = position.Id;
            }
            else
            {
                var checkExistedPosition = await _unitOfWork.PositionRepository.GetPositionByNameAsync(request.Position);

                if (checkExistedPosition != null)
                {
                    userWorkPlace.PositionId = checkExistedPosition.Id;
                }
                else
                {
                    var newPosition = new Domain.Entity.System.Position();
                    newPosition.Name = request.Position;

                    await _unitOfWork.PositionRepository.CreatePositionAsync(newPosition);
                    userWorkPlace.PositionId = newPosition.Id;
                }

            }

            await _unitOfWork.UserWorkPlaceRepository.CreateUserWorkPlaceAsync(userWorkPlace);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật thông tin việc làm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
