import images from "../assets";
import notis from "../assets/noti";
import { NotificationType } from "../enums/notification-type";

export const getNotificationIcon = (notificationType: NotificationType) => {
    if (notificationType.includes('COMMENT')) return notis.commentNoti;

    const userNotiTypes = [
        NotificationType.FRIEND_REQUEST_ACCEPTED,
        NotificationType.FRIEND_REQUEST_SENT,
    ];
    if (userNotiTypes.includes(notificationType)) return notis.userNoti;

    const groupNotiTypes = [
        NotificationType.JOIN_GROUP_REQUEST,
        NotificationType.APPROVAL_GROUP_INVITATION,
        NotificationType.APPROVAL_JOIN_GROUP_REQUEST,
        NotificationType.INVITE_JOIN_GROUP,
    ];
    if (groupNotiTypes.includes(notificationType)) return images.group;

    if (notificationType === NotificationType.POST_SHARED) return notis.notiShare;
    if (notificationType === NotificationType.VIEW_STORY) return notis.viewStory;

    const reactionNotiTypes = [
        NotificationType.REACT_STORY,
        NotificationType.POST_REACTION,
    ];
    if (reactionNotiTypes.includes(notificationType)) return notis.notiReaction;

    if (notificationType === NotificationType.ASSIGN_POST_TAG) return notis.notiTag;

    const reportNotiTypes = [
        NotificationType.REPORT_RESPONSE_REPORTEE,
        NotificationType.REPORT_RESPONSE_REPORTER,
    ];

    if (reportNotiTypes.includes(notificationType)) return notis.notiReport;

    if (notificationType === NotificationType.APPROVAL_POST) return notis.notiApproval;

    return notis.notiBell;
};
