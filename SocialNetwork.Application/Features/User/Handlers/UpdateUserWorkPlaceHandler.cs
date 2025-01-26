

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class UpdateUserWorkPlaceHandler : IRequestHandler<UpdateUserWorkPlaceCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserWorkPlaceHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(UpdateUserWorkPlaceCommand request, CancellationToken cancellationToken)
        {
            var userWorkPlace = await _unitOfWork.UserWorkPlaceRepository.GetUserWorkPlaceByIdAsync(request.UserWorkPlaceId)
                ?? throw new NotFoundException("Thông tin học vấn không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (request.UserWorkPlace.CompanyId.HasValue)
            {
                var company = await _unitOfWork.CompanyRepository.GetCompanyByIdAsync(request.UserWorkPlace.CompanyId.Value)
                     ?? throw new NotFoundException("Thông tin công ty/doanh nghiệp/tổ chức không tồn tại");

                userWorkPlace.CompanyId = company.Id;
            }
            else
            {
                var checkExistedCompany = await _unitOfWork.CompanyRepository.GetCompanyByNameAsync(request.UserWorkPlace.Company);

                if (checkExistedCompany != null)
                {
                    userWorkPlace.CompanyId = checkExistedCompany.Id;
                }
                else
                {
                    var newCompany = new Domain.Entity.System.Company();
                    newCompany.Name = request.UserWorkPlace.Company;

                    await _unitOfWork.CompanyRepository.CreateCompanyAsync(newCompany);
                    userWorkPlace.CompanyId = newCompany.Id;
                }

            }

            if (request.UserWorkPlace.PositionId != null && request.UserWorkPlace.PositionId.HasValue)
            {
                var position = await _unitOfWork.PositionRepository.GetPositionByIdAsync(request.UserWorkPlace.PositionId.Value)
                    ?? throw new NotFoundException("Thông tin ví trí việc làm không tồn tại");

                userWorkPlace.PositionId = position.Id;
            }
            else
            {
                var checkExistedPosition = await _unitOfWork.PositionRepository.GetPositionByNameAsync(request.UserWorkPlace.Position);

                if (checkExistedPosition != null)
                {
                    userWorkPlace.PositionId = checkExistedPosition.Id;
                }
                else
                {
                    var newPosition = new Domain.Entity.System.Position();
                    newPosition.Name = request.UserWorkPlace.Position;

                    await _unitOfWork.PositionRepository.CreatePositionAsync(newPosition);
                    userWorkPlace.PositionId = newPosition.Id;
                }

            }

            userWorkPlace.IsCurrent = request.UserWorkPlace.IsCurrent;
            if (request.UserWorkPlace.IsCurrent && request.UserWorkPlace.StartYear.HasValue)
            {
                userWorkPlace.StartYear = request.UserWorkPlace.StartYear.Value;
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                Message = "Cập nhật thông tin việc làm thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
