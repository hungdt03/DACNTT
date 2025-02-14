import { FC, useEffect, useState } from "react";
import { PostMediaResource } from "../../../../types/post";
import { Link } from "react-router-dom";
import MediaGallery from "../../../MediaGallery";
import { CloseOutlined } from '@ant-design/icons'
import { Empty, Modal } from "antd";
import { inititalValues } from "../../../../utils/pagination";
import userService from "../../../../services/userService";

type ProfileVideoProps = {
    userId: string;
    isMe: boolean;
}

const ProfileVideo: FC<ProfileVideoProps> = ({
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
    const [videos, setVideos] = useState<PostMediaResource[]>([])

    const fetchVideos = async () => {
        let response;
        setLoading(true)
        if (isMe) {
            response = await userService.getPostVideos(1, 4);
        } else {
            response = await userService.getPostVideosByUserId(userId, 1, 4);
        }
        setLoading(false)

        if (response.isSuccess) {
            setVideos(response.data);
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [userId, isMe])

    return <>
        <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
            <span className="font-bold text-[15px] md:text-lg text-gray-700">File video</span>

            {videos.length === 0 && !loading && <div className="grid grid-cols-2 gap-1">
                {videos.map((video, index) => <video
                    key={video.id}
                    src={video.mediaUrl}
                    className="w-full h-full object-cover aspect-square"
                    onClick={() => handlePreview(index)}
                    controls
                />)}
            </div>}

            {pagination.hasMore && <Link to={`/profile/${userId}/videos`} className="text-center bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</Link>}
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

export default ProfileVideo;
