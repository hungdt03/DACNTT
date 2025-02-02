import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Empty, Image } from "antd";
import { Earth, Eye, EyeClosed, EyeIcon, Lock, LucideEarth, Newspaper } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { GroupResource } from "../../types/group";
import { PostMediaResource } from "../../types/post";
import postService from "../../services/postService";
import { MediaType } from "../../enums/media";
import { GroupPrivacy } from "../../enums/group-privacy";

type GroupRightSideProps = {
    group: GroupResource
}

const GroupRightSide: FC<GroupRightSideProps> = ({
    group
}) => {
    const [medias, setMedias] = useState<PostMediaResource[]>([]);
    const [hasNext, setHasNext] = useState(false)

    const fetchGroupPostMedias = async () => {
        const response = await postService.getGroupPostMediaByGroupId(group.id, 1, 4);
        if (response.isSuccess) {
            setMedias(response.data);
            setHasNext(response.pagination.hasMore)
        }
    }

    useEffect(() => {
        fetchGroupPostMedias()
    }, [group])

    return <div className="lg:flex flex-col h-full gap-y-4 hidden lg:col-span-5 py-6 overflow-y-auto custom-scrollbar">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-2">
            <span className="font-bold text-lg text-gray-700">Giới thiệu</span>

            <div className="flex flex-col gap-y-2">
                <p>{group.description}</p>
                <div className="flex items-start gap-x-2">
                    {group.privacy === GroupPrivacy.PRIVATE ? <Lock size={22} /> : <LucideEarth size={22} />}
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">{group.privacy === GroupPrivacy.PRIVATE ? 'Riêng tư' : 'Công khai'}</span>
                        {group.privacy === GroupPrivacy.PRIVATE ? <p>Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</p> : <p>Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.</p>}
                    </div>
                </div>

                <div className="flex items-start gap-x-2">
                    <Eye size={22} />
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">Hiển thị</span>
                        {group.isHidden ? <p>Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</p> : <p>Ai cũng có thể tìm thấy nhóm này.</p>}
                    </div>
                </div>

            </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-2">
            <span className="font-bold text-lg text-gray-700">Hoạt động</span>

            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2 text-gray-600">
                    <Newspaper size={20} />
                    <p>Hôm nay có 2 bài viết mới</p>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600">
                    <UserGroupIcon className="w-5" />
                    <p>Tổng cộng 35.757 thành viên</p>
                </div>
            </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">File phương tiện mới đây</span>

            {medias.length > 0 ? <div className="grid grid-cols-2 gap-1 rounded-md overflow-hidden">
                {medias.map(media => {
                    if (media.mediaType === MediaType.IMAGE)
                        return <Image preview={{
                            mask: 'Xem'
                        }} className="object-cover" width={'100%'} height={'100%'} key={media.id} src={media.mediaUrl} />

                    return <video key={media.id}
                        src={media.mediaUrl}
                        className="w-full object-cover h-full"
                        controls
                    />
                })}
            </div> : <Empty description='Chưa có file phương tiện nào' />}

            {hasNext && <button className="bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</button>}
        </div>
    </div>
};

export default GroupRightSide;
