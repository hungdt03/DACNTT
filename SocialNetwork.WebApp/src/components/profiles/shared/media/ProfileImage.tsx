import { FC, useEffect, useState } from "react";
import { PostMediaResource } from "../../../../types/post";
import { Empty, Image } from "antd";
import { Link } from "react-router-dom";
import { inititalValues } from "../../../../utils/pagination";
import userService from "../../../../services/userService";

type ProfileImageProps = {
    userId: string;
    isMe: boolean;
}

const ProfileImage: FC<ProfileImageProps> = ({
    userId,
    isMe
}) => {
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState(inititalValues)
    const [images, setImages] = useState<PostMediaResource[]>([])

    const fetchPostImage = async () => {
        let response;
        setLoading(true)
        if (isMe) {
            response = await userService.getPostImages(1, 4);
        } else {
            response = await userService.getPostImagesByUserId(userId, 1, 4);
        }
        setLoading(false)

        if (response.isSuccess) {
            setImages(response.data);
            setPagination(response.pagination)
        }
    }

    useEffect(() => {
        fetchPostImage()
    }, [userId, isMe])

    return <div className="p-4 bg-white rounded-md shadow flex flex-col gap-y-3">
        <span className="font-bold text-[15px] md:text-lg text-gray-700">File ảnh</span>

        {!loading && <div className="grid grid-cols-2 gap-1">
            {images.map(image => <Image
                className="object-cover"
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
        </div>}

        {pagination.hasMore && <Link to={`/profile/${userId}/images`} className="text-center bg-sky-50 py-1 w-full text-primary rounded-md hover:bg-sky-100 transition-all ease-linear duration-150">Xem tất cả</Link>}
    </div>
};

export default ProfileImage;
