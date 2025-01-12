

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetNearbyCommentsByCommentIdHandler : IRequestHandler<GetNearbyCommentsByCommentIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetNearbyCommentsByCommentIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetNearbyCommentsByCommentIdQuery request, CancellationToken cancellationToken)
        {
            var comments = await _unitOfWork.CommentRepository.GetNearbyCommentsByPostAsync(request.PostId, request.CommentId);

            var response = new List<CommentResponse>();
            foreach (var comment in comments)
            {
                var commentItem = ApplicationMapper.MapToComment(comment);

                if(comment.Replies != null && comment.Replies.Count > 0)
                    AddReplies(commentItem, comment.Replies);
                response.Add(commentItem);
            }

            return new DataResponse<List<CommentResponse>>() { 
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                
            };
        }

        void AddReplies(CommentResponse parentResponse, ICollection<Domain.Entity.Comment> replies)
        {
            parentResponse.Replies ??= new List<CommentResponse>();
            foreach (var reply in replies)
            {
                var replyItem = ApplicationMapper.MapToComment(reply);
                parentResponse.Replies.Add(replyItem);

                if (reply.Replies != null && reply.Replies.Count > 0)
                    AddReplies(replyItem, reply.Replies);
            }
        }
    }
}
