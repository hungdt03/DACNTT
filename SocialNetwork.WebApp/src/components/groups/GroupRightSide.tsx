import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Empty, Image } from "antd";
import { Book, Eye, Lock, LucideEarth, Newspaper } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { GroupResource } from "../../types/group";
import { PostMediaResource } from "../../types/post";
import { GroupPrivacy } from "../../enums/group-privacy";
import groupService from "../../services/groupService";
import { Link } from "react-router-dom";

type GroupRightSideProps = {
    group: GroupResource
}

const GroupRightSide: FC<GroupRightSideProps> = ({
    group
}) => {
    const [images, setImages] = useState<PostMediaResource[]>([]);
    const [videos, setVideos] = useState<PostMediaResource[]>([]);
    const [hasImageNext, setHasImageNext] = useState(false)
    const [hasVideoNext, setHasVideoNext] = useState(false)

    const fetchGroupImages = async () => {
        const response = await groupService.getAllGroupImagesByGroupId(group.id, 1, 4);
        if (response.isSuccess) {
            setImages(response.data);
            setHasImageNext(response.pagination.hasMore)
        }
    }


    const fetchGroupVideos = async () => {
        const response = await groupService.getAllGroupVideosByGroupId(group.id, 1, 4);
        if (response.isSuccess) {
            setVideos(response.data);
            setHasVideoNext(response.pagination.hasMore)
        }
    }

    useEffect(() => {
        fetchGroupImages();
        fetchGroupVideos()
    }, [group])

    return <div className="lg:flex flex-col h-full gap-y-4 hidden lg:col-span-5 py-6 overflow-y-auto scrollbar-hide">
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-2">
            <span className="font-bold text-lg text-gray-700">Giới thiệu</span>

            <div className="flex flex-col gap-y-2">
                <p>{group.description}</p>
                <div className="flex items-start gap-x-2">
                    {group.privacy === GroupPrivacy.PRIVATE ? <Lock size={24} /> : <LucideEarth size={24} />}
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">{group.privacy === GroupPrivacy.PRIVATE ? 'Riêng tư' : 'Công khai'}</span>
                        {group.privacy === GroupPrivacy.PRIVATE ? <p>Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</p> : <p>Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.</p>}
                    </div>
                </div>

                <div className="flex items-start gap-x-2">
                    <Eye size={22} />
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">Hiển thị</span>
                        {group.isHidden ? <p>Chỉ thành viên mới tìm thấy nhóm này</p> : <p>Ai cũng có thể tìm thấy nhóm này.</p>}
                    </div>
                </div>

                <div className="flex items-start gap-x-2">
                    <Book size={20} />
                    <div className="flex flex-col gap-y-1">
                        <span className="font-bold">Đăng bài</span>
                        {group.onlyAdminCanPost ? <p>Chỉ quản trị viên và người kiểm duyệt mới đăng tải bài viết</p> : <p>Tất cả thành viên đều có thể đăng tải bài viết</p>}
                    </div>
                </div>

            </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-2">
            <span className="font-bold text-lg text-gray-700">Hoạt động</span>

            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2 text-gray-600">
                    <Newspaper size={20} />
                    <p>Hôm nay có {group.countTodayPosts} bài viết mới</p>
                </div>
                <div className="flex items-center gap-x-2 text-gray-600">
                    <UserGroupIcon className="w-5" />
                    <p>Tổng cộng {group.countMembers} thành viên</p>
                </div>
            </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">Ảnh</span>

            {images.length > 0 ? <div className="grid grid-cols-2 gap-1 rounded-md overflow-hidden">
                {images.map(media => (
                    <div key={media.id} style={{
                        aspectRatio: 1 / 1
                    }} className="relative w-full overflow-hidden">
                        <Image
                            preview={{ mask: 'Xem' }}
                            className="object-cover"
                            width={'100%'}
                            height={'100%'}
                            src={media.mediaUrl}
                        />
                    </div>
                ))}
            </div> : <Empty description="Chưa có file ảnh nào" />}
            {hasImageNext && <Link to={`/groups/${group.id}/images`} className="text-center bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</Link>}
        </div>

        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-lg text-gray-700">Video</span>
            {videos.length > 0 ? <div className="grid grid-cols-2 gap-1 rounded-md overflow-hidden">
                {videos.map(media => (
                    <div key={media.id} style={{
                        aspectRatio: 1 / 1
                    }} className="relative w-full overflow-hidden">
                        <video
                            src={media.mediaUrl}
                            className="w-full h-full object-cover"
                            controls
                        />
                    </div>
                ))}
            </div> : <Empty description="Chưa có file video nào" />}
            {hasVideoNext && <Link to={`/groups/${group.id}/videos`} className="text-center bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</Link>}
        </div>
    </div>
};

export default GroupRightSide;
