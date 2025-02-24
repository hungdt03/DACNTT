
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.DTOs.Admin;
using SocialNetwork.Application.DTOs.Score;
using SocialNetwork.Application.Features.Admin.Commands;
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
                Gender = user.Gender,
                RecentOnlineTime = user.RecentOnlineTime,
                IsOnline = user.IsOnline,
                IsShowStory = true,
                IsShowStatus = true,
                PhoneNumber = user.PhoneNumber,
                IsLock = user.IsLock,
            };
        }
        public static List<UserResponse> MapToListUser(List<User> users)
        {
            return users.Select(user => new UserResponse
            {
                Id = user.Id,
                Avatar = user.Avatar,
                CoverImage = user.CoverImage,
                Bio = user.Bio,
                Email = user.Email,
                FullName = user.FullName,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                PhoneNumber = user.PhoneNumber,
                IsDeleted = user.IsDeleted,
                DateJoined = user.DateJoined,
                Isverification = user.IsVerification,
                Location = user.Location != null ? user.Location.Address : null,
                IsLock = user.IsLock,
                RecentOnlineTime = user.RecentOnlineTime,
                IsOnline = user.IsOnline,
                IsShowStory = true,
                IsShowStatus = true,
            }).ToList();
        }
        public static List<ScoreResponse> MapToUserScore(List<UserScore> userScores)
        {
            return userScores.Select(user => new ScoreResponse
            {
                Score = user.Score,
                User = user.User
            }).ToList();
        }

        public static ChatRoomMemberResponse MapToChatRoomMember(ChatRoomMember chatRoomMember)
        {
            return new ChatRoomMemberResponse()
            {
                User = chatRoomMember.User != null ? MapToUser(chatRoomMember.User) : null,
                Id = chatRoomMember.Id,
                IsAccepted = chatRoomMember.IsAccepted,
                IsLeader = chatRoomMember.IsLeader,
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
                DateCreated = group.DateCreated,
                Members = group.Members != null ? group.Members.Select(m => m.User != null ? MapToUser(m.User) : null).ToList() : new(),
            };
        }

        public static GroupAdminResponse MapToGroupAdmin(Group group)
        {
            return new GroupAdminResponse()
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
                DateCreated = group.DateCreated,
                //Members = group.Members != null ? group.Members.Select(m => m.User != null ? MapToUser(m.User) : null).ToList() : new(),
            };
        }

        public static List<GroupResponse> MapToListGroup(IEnumerable<Group> groups)
        {
            return groups.Select(group => new GroupResponse()
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
                DateCreated = group.DateCreated,
                IsDeleted = group.IsDeleted,
            }).ToList();
        }

        public static GroupInvitationRespone MapToGroupInvitation(GroupInvitation groupInvitation)
        {
            return new GroupInvitationRespone()
            {
                Id = groupInvitation.Id,
                Invitee = groupInvitation.Invitee != null ? MapToUser(groupInvitation.Invitee) : null,
                Inviter = groupInvitation.Inviter != null ? MapToUser(groupInvitation.Inviter) : null,
                Status = groupInvitation.Status,
                Group = groupInvitation.Group != null ? MapToGroup(groupInvitation.Group) : null,
                DateCreated = groupInvitation.DateCreated,
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
                DateCreatedAt = report.DateCreated
            };
        }
        public static List<ReportResponse> MapToListReport(List<Report> reports)
        {
            return reports.Select( report => new ReportResponse
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
                DateCreatedAt = report.DateCreated
            }).ToList();
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

        public static BlockResponse MapToBlock(BlockList blockList)
        {
            return new BlockResponse()
            {
                Id = blockList.Id,
                BlockeeId = blockList.BlockeeId,
                BlockerId = blockList.BlockerId,
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
                ImageUrl = chatRoom.ImageUrl,
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
        public static List<PostResponse> MapToListPost(List<Post> posts)
        {
            if (posts == null) return null;
            return posts.Select(post => new PostResponse
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
                Reactions = post.Reactions != null ? post.Reactions.Count : 0,
            }).ToList();
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
                SenderId = friendRequest.UserId,
                ReceiverId = friendRequest.FriendId,
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
                FriendRequest = notification.FriendRequest != null ? MapToFriendRequest(notification.FriendRequest) : null,
                ImageUrl = notification.ImageUrl,
                IsRead = notification.IsRead,
                PostId = notification.PostId,
                StoryId = notification.StoryId,
                GroupId = notification.GroupId,
                JoinGroupRequestId = notification.JoinGroupRequestId,
                GroupInvitationId = notification.GroupInvitationId,
                GroupRoleInvitationId = notification.GroupRoleInvitationId,
                Recipient = notification.Recipient != null ? MapToUser(notification.Recipient) : null,
                Title = notification.Title,
                Type = notification.Type,
                ReportId = notification.ReportId,
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
                RecentOnlineTime = user.RecentOnlineTime,
                IsOnline = user.IsOnline,
            };
        }
    }
}
