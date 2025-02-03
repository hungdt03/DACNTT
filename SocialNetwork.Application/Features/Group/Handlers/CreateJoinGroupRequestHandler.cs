using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class CreateJoinGroupRequestHandler : IRequestHandler<CreateJoinGroupRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalService;

        public CreateJoinGroupRequestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalService = signalRService;
        }

        public async Task<BaseResponse> Handle(CreateJoinGroupRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Nhóm không tồn tại");

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (groupMember != null) throw new AppException("Bạn đã là thành viên của nhóm");
            
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            string message = "Yêu cầu xin tham gia nhóm của bạn đã được gửi đi";

            if(group.RequireApproval)
            {
                var joinGroupRequest = new JoinGroupRequest()
                {
                    GroupId = request.GroupId,
                    Status = false,
                    UserId = userId,
                };

                await _unitOfWork.JoinGroupRequestRepository.CreateJoinGroupRequestAsync(joinGroupRequest);

            } else
            {
                var newGroupMember = new GroupMember()
                {
                    GroupId = request.GroupId,
                    Role = MemberRole.MEMBER,
                    JoinDate = DateTimeOffset.UtcNow,
                    UserId = userId,
                };

                await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(newGroupMember);
                message = "Bạn đã trở thành viên của nhóm";
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new DataResponse<JoinGroupResponse>()
            {
                Data = new JoinGroupResponse()
                {
                    IsApproval = !group.RequireApproval
                },
                IsSuccess = true,
                Message = message,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
