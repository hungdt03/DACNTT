import { FC } from "react";
import { TagResource } from "../../types/tag";
import { Link } from "react-router-dom";

type PostOtherTagsProps = {
    tags: TagResource[]
}

const PostOtherTags: FC<PostOtherTagsProps> = ({
    tags
}) => {
    return <div className="flex flex-col gap-y-1">
        {tags.map(tag => <Link key={tag.id} to={`/profile/${tag.user.id}`} className="text-xs hover:text-white hover:underline">{tag.user.fullName}</Link>)}
    </div>
};

export default PostOtherTags;
