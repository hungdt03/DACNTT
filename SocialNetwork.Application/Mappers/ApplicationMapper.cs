
using SocialNetwork.Application.DTOs;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Mappers
{
    public class ApplicationMapper
    {
        public static UserResponse MapToUser(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Avatar = user.Avatar,
                Bio = user.Bio,
                Email = user.Email,
                FullName = user.FullName,
            };
        } 

        public static PostResponse MapToPost(Post post)
        {
            if (post == null) return null;
            return new PostResponse
            {
                Id = post.Id,
                Content = post.Content,
                Privacy = post.Privacy,
                SharePostId = post.SharePostId,
                OriginalPostId = post.OriginalPostId,
                CreatedAt = post.DateCreated,
                PostType = post.PostType,
                Medias = post.Medias != null ? post.Medias.Select(MapToPostMedia).ToList() : new(),
                User = post.User != null ? MapToUser(post.User) : null,
                Comments = post.Comments != null ?post.Comments.Count : 0,
                Shares = post.Shares != null ?post.Shares.Count : 0,
                SharePost = MapToPost(post.SharePost),
                OriginalPost = MapToPost(post.OriginalPost),
            };
        }

        public static MediaResponse MapToPostMedia(PostMedia media) {
            return new MediaResponse
            {
                Id = media.Id,
                MediaType = media.MediaType,
                MediaUrl = media.MediaUrl,
            };
        }

        public static CommentResponse MapToComment(Comment comment)
        {
            return new CommentResponse
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.DateCreated,
                MediaUrl = comment.MediaUrl,
                ReplyToUserId = comment.ReplyToUserId,
                ReplyToUserName = comment.ReplyToUserName,
                ParentCommentId = comment.ParentCommentId,
                User = comment.User != null ? MapToUser(comment.User) : null,
                IsHaveChildren = comment.Replies != null && comment.Replies.Count > 0,
            };
        }

        public static ReactionResponse MapToReaction(Reaction reaction)
        {
            return new ReactionResponse
            {
                Id = reaction.Id,
                PostId = reaction.Id,
                ReactionType = reaction.Type,
                User = reaction.User != null ? MapToUser(reaction.User) : null
            };
        }
    }
}
