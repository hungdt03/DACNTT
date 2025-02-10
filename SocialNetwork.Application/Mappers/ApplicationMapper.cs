
using SocialNetwork.Application.DTOs;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.MessageInfo;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Domain.Entity.UserInfo;

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
                CoverImage = user.CoverImage,
                Bio = user.Bio,
                Email = user.Email,
                FullName = user.FullName,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender    
            };
        } 

        public static TagResponse MapToTag(Tag tag)
        {
            return new TagResponse
            {
                Id = tag.Id,
                User = tag.User != null ? MapToFriend(tag.User) : null
            };
        }

        public static GroupResponse MapToGroup(Group group)
        {
            return new GroupResponse()
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                CoverImage = group.CoverImage,
                Privacy = group.Privacy,
                IsHidden = group.IsHidden,
                OnlyAdminCanApprovalMember = group.OnlyAdminCanApprovalMember,
                OnlyAdminCanPost = group.OnlyAdminCanPost,
                RequireApproval = group.RequireApproval,
                RequireApprovalPost = group.RequirePostApproval,
                Members = group.Members != null ? group.Members.Select(m => m.User != null ? MapToUser(m.User) : null).ToList() : new(),
            };
        }

        public static GroupMemberResponse MapToGroupMember(GroupMember member)
        {
            return new GroupMemberResponse()
            {
                Id = member.Id,
                JoinDate = member.JoinDate,
                Role = member.Role,
                User = member.User != null ? MapToUser(member.User) : null,
            };
        }

        public static SearchHistoryResponse MapToSearch(SearchHistory searchHistory)
        {
            return new SearchHistoryResponse()
            {
                Id = searchHistory.Id,
                Group = searchHistory.SearchGroup != null ? MapToGroup(searchHistory.SearchGroup) : null,
                User = searchHistory.SearchUser != null ? MapToUser(searchHistory.SearchUser) : null,
                SearchAt = searchHistory.DateCreated,
                SearchText = searchHistory.SearchText
            };
        }

        public static ReportResponse MapToReport(Report report)
        {
            return new ReportResponse()
            {
                Id = report.Id,
                Group = report.Group != null ? MapToGroup(report.Group) : null,
                Reason = report.Reason,
                Reporter = report.Reporter != null ? MapToUser(report.Reporter) : null,
                ReportType = report.ReportType,
                ResolutionNotes = report.ResolutionNotes,
                ResolvedAt = report.ResolvedAt,
                Status = report.Status,
                TargetComment = report.TargetComment != null ? MapToComment(report.TargetComment) : null,
                TargetGroup = report.TargetGroup != null ? MapToGroup(report.TargetGroup) : null,
                TargetPost = report.TargetPost != null ? MapToPost(report.TargetPost) : null,
                TargetUser = report.TargetUser != null ? MapToUser(report.TargetUser) : null,
            };
        }

        public static MessageResponse MapToMessage(Message message)
        {
            return new MessageResponse()
            {
                Id = message.Id,
                ChatRoomId = message.ChatRoomId,
                Content = message.Content,
                Medias = message.Medias != null ? message.Medias.Select(MapToMessageMedia).ToList() : new(),
                MessageType = message.MessageType,
                Sender = message.Sender != null ? MapToUser(message.Sender) : null,
                SenderId = message.SenderId,
                SentAt = message.SentAt,
                Reads = message.Reads != null ? message.Reads.Select(read => new ReadStatus()
                {
                    UserId = read.UserId,
                    User = read.User != null ? MapToUser(read.User) : null,
                    ReadAt = read.ReadAt
                }).ToList() : null
            };
        }

        public static ChatRoomResponse MapToChatRoom(ChatRoom chatRoom)
        {
            return new ChatRoomResponse
            {
                Id = chatRoom.Id,
                IsPrivate = chatRoom.IsPrivate,
                UniqueName = chatRoom.UniqueName,
                Name = chatRoom.Name,
                LastMessage = chatRoom.LastMessage,
                LastMessageDate = chatRoom.LastMessageDate,
                Members = chatRoom.Members.Any() ? chatRoom.Members.Select(member => MapToUser(member.User)).ToList() : new(),

            };
        }

        public static GroupRoleInvitationResponse MapToGroupRoleInvitation(GroupRoleInvitation groupRoleInvitation)
        {
            return new GroupRoleInvitationResponse()
            {
                Id = groupRoleInvitation.Id,
                Group = groupRoleInvitation.Group != null ? MapToGroup(groupRoleInvitation.Group) : null,
                Invitee = groupRoleInvitation.Invitee != null ? MapToUser(groupRoleInvitation.Invitee) : null,
                Inviter = groupRoleInvitation.Inviter != null ? MapToUser(groupRoleInvitation.Inviter) : null,
                Role = groupRoleInvitation.Role
            };
        }

        public static JoinGroupRequestResponse MapToJoinGroupRequest(JoinGroupRequest joinGroupRequest)
        {
            return new JoinGroupRequestResponse()
            {
                Id = joinGroupRequest.Id,
                RequestDate = joinGroupRequest.DateCreated,
                User = joinGroupRequest.User != null ? MapToUser(joinGroupRequest.User) : null
            };
        }

        public static PostResponse MapToPost(Post post)
        {
            if (post == null) return null;
            return new PostResponse
            {
                Id = post.Id,
                Content = post.Content,
                Background = post.Background,
                Privacy = post.Privacy,
                SharePostId = post.SharePostId,
                OriginalPostId = post.OriginalPostId,
                CreatedAt = post.DateCreated,
                PostType = post.PostType,
                IsGroupPost = post.IsGroupPost,
                Medias = post.Medias != null ? post.Medias.Select(MapToPostMedia).ToList() : new(),
                User = post.User != null ? MapToUser(post.User) : null,
                Tags = post.Tags != null ? post.Tags.Select(MapToTag).ToList() : new(),
                Comments = post.Comments != null ? post.Comments.Count : 0,
                Shares = post.Shares != null ? post.Shares.Count : 0,
                SharePost = post.SharePost != null ? MapToPost(post.SharePost) : null,
                OriginalPost = post.OriginalPost != null ? MapToPost(post.OriginalPost) : null,
                Group = post.Group != null ? MapToGroup(post.Group) : null,
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

        public static MediaResponse MapToMessageMedia(MessageMedia media)
        {
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
                SentAt = comment.SentAt,
                MediaUrl = comment.MediaUrl,
                ReplyToUserId = comment.ReplyToUserId,
                ReplyToUserName = comment.ReplyToUserName,
                ParentCommentId = comment.ParentCommentId,
                MediaType = comment.MediaType,
                PostId = comment.PostId,
                User = comment.User != null ? MapToUser(comment.User) : null,
                IsHaveChildren = comment.Replies != null && comment.Replies.Count > 0,
            };
        }

        public static StoryResponse MapToStory(Story story)
        {
            return new StoryResponse
            {
                Id = story.Id,
                Background = story.Background,
                User = story.User != null ? MapToUser(story.User) : null,
                Content = story.Content,
                FontFamily = story.FontFamily,
                Privacy = story.Privacy,
                Type = story.Type,
                CreatedDate = story.DateCreated,
            };
        }

        public static ViewerResponse MapToViewerResponse(Viewer viewer, List<string> reactions)
        {
            return new ViewerResponse()
            {
                User = viewer.User != null ? ApplicationMapper.MapToUser(viewer.User) : null,
                Reactions = reactions
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

        public static FriendRequestResponse MapToFriendRequest(FriendShip friendRequest)
        {
            return new FriendRequestResponse
            {
                Id = friendRequest.Id,
                Sender = friendRequest.User != null ? MapToUser(friendRequest.User) : null,
                SentAt = friendRequest.DateCreated,
                Status = friendRequest.Status,
            };
        }
        public static List<FriendRequestResponse> MapToFriendRequestList(List<FriendShip> friendRequests)
        {
            return friendRequests.Select(friendRequest => new FriendRequestResponse
            {
                Id = friendRequest.Id,
                Sender = friendRequest.User != null ? MapToUser(friendRequest.User) : null,
                SentAt = friendRequest.DateCreated,
                Status = friendRequest.Status,
            }).ToList();
        }

        public static NotificationResponse MapToNotification(Notification notification)
        {
            return new NotificationResponse()
            {
                Id = notification.Id,
                CommentId = notification.CommentId,
                Content = notification.Content,
                DateSent = notification.DateSent,
                FriendRequestId = notification.FriendRequestId,
                ImageUrl = notification.ImageUrl,
                IsRead = notification.IsRead,
                PostId = notification.PostId,
                StoryId = notification.StoryId,
                GroupId = notification.GroupId,
                GroupInvitationId = notification.GroupInvitationId,
                Recipient = notification.Recipient != null ? MapToUser(notification.Recipient) : null,
                Title = notification.Title,
                Type = notification.Type,
            };
        }

        public static FriendResponse MapToFriend(User user)
        {
            return new FriendResponse()
            {
                Id = user.Id,
                Avatar = user.Avatar,
                CoverImage = user.CoverImage,
                Bio = user.Bio,
                Email = user.Email,
                FullName = user.FullName,
            };
        }
    }
}
