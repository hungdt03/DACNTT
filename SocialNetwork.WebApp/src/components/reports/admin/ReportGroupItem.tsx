import { Divider } from "antd";
import { FC } from "react";
import { GroupResource } from "../../../types/group";
import { formatDateStandard } from "../../../utils/date";
import PostNotFound from "../../posts/PostNotFound";

type ReportGroupItemProps = {
    group: GroupResource
}

const ReportGroupItem: FC<ReportGroupItemProps> = ({
    group
}) => {

    if(group === null) return <PostNotFound title='Nhóm không tồn tại hoặc đã bị giải tán' />
    return <div className="flex flex-col gap-y-4 col-span-4 shadow bg-white rounded-md p-4">
        <img
            style={{
                aspectRatio: 3 / 1
            }}
            className="object-cover rounded-md"
            src={group?.coverImage}
        />

        <div className="flex flex-col items-center gap-y-2">
            <span className="text-xl font-bold">{group?.name}</span>
            <p className="text-sm text-gray-600 line-clamp-3">{group?.description}</p>
        </div>
        <Divider className="my-0" />
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <span className="font-semibold">Ngày lập</span>
                <span className="text-sm text-gray-600">{formatDateStandard(new Date(group.dateCreated))}</span>
            </div>
        </div>
    </div>
};

export default ReportGroupItem;
