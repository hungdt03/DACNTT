import PostMixMedia from '../medias/mix/PosMixMedia'
import PostImage from "../medias/images/PostImage";
import { PostMediaResource } from "../../types/post";
import { MediaType } from "../../enums/media";

interface PostMediaProps {
    files: PostMediaResource[];
}

const PostMedia: React.FC<PostMediaProps> = ({ files }) => {
    
    if(files.some(item => item.mediaType === MediaType.VIDEO)) {
        return <PostMixMedia items={files} />
    }

    return <PostImage items={files} />

};

export default PostMedia;