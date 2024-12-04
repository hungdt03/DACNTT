import { FC } from "react";
import Notification from "../Notification";
import { NotificationResource } from "../../types/notification";
import { Button, Empty } from "antd";
import { Pagination } from "../../types/response";

type NotificationDialogProps = {
    notifications: NotificationResource[];
    onDelete?: (notificationId: string) => void;
    onMarkAsRead?: (notificationId: string) => void;
    pagination: Pagination;
    onFetchMore: (nextPage: number) => void
}

const NotificationDialog: FC<NotificationDialogProps> = ({
    notifications,
    onDelete,
    onMarkAsRead,
    pagination,
    onFetchMore
}) => {

    return <div className="flex flex-col gap-y-3 p-2 max-h-[600px] min-w-[400px] overflow-y-auto custom-scrollbar">
        <span className="font-semibold text-lg">Thông báo của bạn</span>
        <div className="flex flex-col gap-y-2">
            {notifications.map(notification => <Notification onDelete={() => onDelete?.(notification.id)} onMarkAsRead={() => onMarkAsRead?.(notification.id)} key={notification.id} notification={notification} />)}
            {pagination.hasMore && <Button onClick={() => onFetchMore(pagination.page + 1)} type="primary">Tải thêm</Button>}
            {notifications.length === 0 && <Empty description='Chưa có thông báo nào' />}
        </div>
    </div>
};

export default NotificationDialog;
