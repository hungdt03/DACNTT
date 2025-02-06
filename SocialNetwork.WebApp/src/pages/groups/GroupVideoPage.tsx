import { FC, useEffect, useState } from "react";
import { PostMediaResource } from "../../types/post";
import { useParams } from "react-router-dom";
import { inititalValues } from "../../utils/pagination";
import groupService from "../../services/groupService";
import { Empty, Image } from "antd";
import LoadingIndicator from "../../components/LoadingIndicator";

const GroupVideoPage: FC = () => {
    const { id } = useParams()
    const [videos, setVideos] = useState<PostMediaResource[]>([]);
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(inititalValues);

    const fetchVideos = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllGroupVideosByGroupId(id, page, size);
            setTimeout(() => {
                setLoading(false)
                if (response.isSuccess) {
                    setVideos(prevVideos => {
                        const existingIds = new Set(prevVideos.map(image => image.id));
                        const newVideos = response.data.filter(image => !existingIds.has(image.id));
                        return [...prevVideos, ...newVideos];
                    });
                    setPagination(response.pagination)
                }
            }, 2000)
        }
    }

    const fetchNextPage = () => {
        console.log('Fetch next page ...')
        fetchVideos(pagination.page + 1, pagination.size)
    }

    useEffect(() => {
        const handleScroll = () => {
            const groupLayoutElement = document.getElementById('group-layout');
            if (!groupLayoutElement || loading || !pagination.hasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = groupLayoutElement;

            console.log(`scrollTop: ${scrollTop}, clientHeight: ${clientHeight}, scrollHeight: ${scrollHeight}`);

            if (scrollTop + clientHeight >= scrollHeight - 150) {
                fetchNextPage();
            }
        };

        const groupLayoutElement = document.getElementById('group-layout');
        groupLayoutElement?.addEventListener("scroll", handleScroll);

        return () => groupLayoutElement?.removeEventListener("scroll", handleScroll);
    }, [loading, pagination.hasMore]);

    useEffect(() => {
        fetchVideos(pagination.page, pagination.size)
    }, [id])

    return <div className="p-6 h-full">
        <div className="p-4 rounded-md bg-white shadow flex flex-col gap-y-2">
            <span className="text-lg font-bold">File video được đăng trong nhóm</span>
            {videos.length > 0 ? <div className="grid grid-cols-5 gap-2">
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
            </div> : !loading && <Empty description="Chưa có file video nào" />}
            <div className="col-span-5">{loading && <LoadingIndicator />}</div>
        </div>
    </div>
};

export default GroupVideoPage;
