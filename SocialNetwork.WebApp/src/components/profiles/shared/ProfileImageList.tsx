import { FC, useEffect, useState } from "react";
import { Empty, Image } from "antd";
import { PostMediaResource } from "../../../types/post";
import { inititalValues } from "../../../utils/pagination";
import userService from "../../../services/userService";
import LoadingIndicator from "../../LoadingIndicator";
import { useElementInfinityScroll } from "../../../hooks/useElementInfinityScroll";

type ProfileImageListProps = {
    userId: string;
    isMe: boolean;
}

const ProfileImageList: FC<ProfileImageListProps> = ({
    userId,
    isMe
}) => {
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(inititalValues)
    const [images, setImages] = useState<PostMediaResource[]>([])

    const fetchPostImage = async (page: number, size: number) => {
        let response;
        setLoading(true)
        if (isMe) {
            response = await userService.getPostImages(page, size);
        } else {
            response = await userService.getPostImagesByUserId(userId, page, size);
        }

        setLoading(false)

        if (response.isSuccess) {
            setImages(prevImages => {
                const existingIds = new Set(prevImages.map(video => video.id));
                const newImages = response.data.filter(video => !existingIds.has(video.id));
                return [...prevImages, ...newImages];
            });
            setPagination(response.pagination)
        }
    }

    const fetchMore = () => {
        if (!pagination.hasMore || loading) return;
        fetchPostImage(pagination.page + 1, pagination.size)
    }


    useElementInfinityScroll({
        elementId: "my-profile-page",
        onLoadMore: fetchMore,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });


    useEffect(() => {
        fetchPostImage(pagination.page, pagination.size)
    }, [userId])

    return <div className="flex flex-col gap-4">
        <span className="font-bold text-lg text-gray-700">File ảnh</span>
        {<div className="grid grid-cols-4 gap-2">
            <Image.PreviewGroup>
                {images.map(image => <Image
                    className="object-cover aspect-square"
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    key={image.id}
                    preview={{
                        mask: 'Xem'
                    }}
                    src={image.mediaUrl}
                />)}
            </Image.PreviewGroup>
        </div>}
        {images.length === 0 && !loading && <Empty className="col-span-2" description='Chưa có file ảnh nào' />}

        {loading && <LoadingIndicator />}

        {!pagination.hasMore && !loading && images.length > 0 && (
            <p className="text-center text-gray-500">Không còn ảnh để tải.</p>
        )}
    </div>
};

export default ProfileImageList;
