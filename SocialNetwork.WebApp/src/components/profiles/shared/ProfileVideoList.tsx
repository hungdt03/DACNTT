import { FC, useEffect, useState } from "react";
import { Empty, Modal, Skeleton } from "antd";
import { PostMediaResource } from "../../../types/post";
import { inititalValues } from "../../../utils/pagination";
import userService from "../../../services/userService";
import MediaGallery from "../../MediaGallery";
import { CloseOutlined } from '@ant-design/icons'
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import LoadingIndicator from "../../LoadingIndicator";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";

type ProfileVideoListProps = {
    userId: string;
    isMe: boolean;
}

const ProfileVideoList: FC<ProfileVideoListProps> = ({
    userId,
    isMe
}) => {

    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [currentPreview, setCurrentPreview] = useState<number>(1);

    const handlePreview = (index: number) => {
        setCurrentPreview(index);
        setPreviewVisible(true);
    };

    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(inititalValues)
    const [videos, setVideos] = useState<PostMediaResource[]>([]);

    const fetchPostVideo = async (page: number, size: number) => {
        let response;
        setLoading(true)
        if (isMe) {
            response = await userService.getPostVideos(page, size);
        } else {
            response = await userService.getPostVideosByUserId(userId, page, size);
        }

        setLoading(false)

        if (response.isSuccess) {
            setVideos(prevVideos => {
                const existingIds = new Set(prevVideos.map(video => video.id));
                const newVideos = response.data.filter(video => !existingIds.has(video.id));
                return [...prevVideos, ...newVideos];
            });
            setPagination(response.pagination)
        }
    }

    const fetchMore = () => {
        if (!pagination.hasMore || loading) return;
        fetchPostVideo(pagination.page + 1, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "my-profile-page",
        onLoadMore: fetchMore,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    useEffect(() => {
        fetchPostVideo(pagination.page, pagination.size)
    }, [userId])

    return <>
        <div className="flex flex-col gap-4">
            <span className="font-bold text-lg text-gray-700">File video</span>
            <div className="grid grid-cols-4 gap-2">
                {videos.length > 0 && videos.map((video, index) => <video
                    key={video.id}
                    src={video.mediaUrl}
                    className="w-full h-full object-cover aspect-square"
                    onClick={() => handlePreview(index)}
                    controls
                />)}
            </div>

            {videos.length === 0 && !loading && <Empty className="col-span-2" description='Chưa có file video nào' />}

            {loading && <LoadingIndicator />}

            {!pagination.hasMore && !loading && videos.length > 0 && (
                <p className="text-center text-gray-500">Không còn video để tải.</p>
            )}

        </div>
        {previewVisible && <button
            onClick={() => setPreviewVisible(false)}
            className="fixed top-10 right-10 z-[8000] font-bold bg-gray-800 bg-opacity-35 w-10 h-10 flex items-center justify-center rounded-full"
        >
            <CloseOutlined className="text-white z-[10000]" />
        </button>}

        <Modal
            open={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            centered
            className="custom-modal"
            styles={{
                body: {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                },
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                wrapper: {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                },
                content: {
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                    boxShadow: 'none'
                },
            }}
            width={900}
        >
            <MediaGallery medias={videos} currentPreview={currentPreview} />
        </Modal>
    </>
};

export default ProfileVideoList;
