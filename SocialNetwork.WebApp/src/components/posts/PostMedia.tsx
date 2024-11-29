import { isVideo } from "../medias/utils";
import PostMixMedia from '../medias/mix/PosMixMedia'
import PostImage from "../medias/images/PostImage";

interface PostMediaProps {
    files: string[];
}

const PostMedia: React.FC<PostMediaProps> = ({ files }) => {
    
    if(files.some(item => isVideo(item))) {
        return <PostMixMedia items={files} />
    }

    return <PostImage items={files} />

};

export default PostMedia;