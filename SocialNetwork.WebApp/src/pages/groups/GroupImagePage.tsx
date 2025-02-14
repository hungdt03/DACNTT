import { FC, useEffect, useState } from "react";
import { PostMediaResource } from "../../types/post";
import { useParams } from "react-router-dom";
import { inititalValues } from "../../utils/pagination";
import groupService from "../../services/groupService";
import { Empty, Image } from "antd";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useElementInfinityScroll } from "../../hooks/useElementInfinityScroll";

const GroupImagePage: FC = () => {
    const { id } = useParams()
    const [images, setImages] = useState<PostMediaResource[]>([]);
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(inititalValues);

    const fetchImages = async (page: number, size: number) => {
        if (id) {
            setLoading(true)
            const response = await groupService.getAllGroupImagesByGroupId(id, page, size);
            setLoading(false)
            if (response.isSuccess) {
                setImages(prevImages => {
                    const existingIds = new Set(prevImages.map(image => image.id));
                    const newImages = response.data.filter(image => !existingIds.has(image.id));
                    return [...prevImages, ...newImages];
                });
                setPagination(response.pagination)
            }
        }
    }

    const fetchNextPage = () => {
        fetchImages(pagination.page + 1, pagination.size)
    }

    useElementInfinityScroll({
        elementId: "group-layout",
        onLoadMore: fetchNextPage,
        isLoading: loading,
        hasMore: pagination.hasMore,
    });

    useEffect(() => {
        fetchImages(pagination.page, pagination.size)
    }, [id])

    return <div className="py-6 h-full w-full max-w-screen-lg mx-auto px-2">
        <div className="p-4 rounded-md bg-white shadow flex flex-col gap-y-2">
            <span className="text-[16px] md:text-lg text-gray-700 font-bold">File ảnh được đăng trong nhóm</span>
            {images.length > 0 ? <Image.PreviewGroup> <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
            </div>  </Image.PreviewGroup> : !loading && <Empty description="Chưa có file ảnh nào" />}
            <div className="col-span-5">{loading && <LoadingIndicator />}</div>
        </div>
    </div >
};

export default GroupImagePage;
