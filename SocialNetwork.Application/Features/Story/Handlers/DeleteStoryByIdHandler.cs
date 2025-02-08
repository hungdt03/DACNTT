
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class DeleteStoryByIdHandler : IRequestHandler<DeleteStoryByIdCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteStoryByIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(DeleteStoryByIdCommand request, CancellationToken cancellationToken)
        {
            var story = await _unitOfWork.StoryRepository.GetStoryByIdAsync(request.StoryId)
                ?? throw new NotFoundException("Không tìm thấy tin");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            //var viewers = await _unitOfWork.ViewerRepository.GetAllViewerByStoryIdAsync(story.Id);
            //_unitOfWork.ViewerRepository.RemoveRange(viewers);
            _unitOfWork.StoryRepository.DeleteStory(story);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
