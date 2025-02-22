using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetCommentByIdIgnoreHandler : IRequestHandler<GetCommentByIdIgnoreQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetCommentByIdIgnoreHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetCommentByIdIgnoreQuery request, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository.GetCommentByIdIgnoreAsync(request.CommentId)
                ?? throw new ApplicationException("không có comment nào");

            return new DataResponse<CommentResponse>()
            {
                Data = ApplicationMapper.MapToComment(comment),
                IsSuccess = true,
                Message = "Lấy bình luận trang trước thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
