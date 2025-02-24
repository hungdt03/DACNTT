import { PostResource } from "./post"

export type TrendingPostResource = {
    post: PostResource;
    reactions: number;
    comments: number;
    shares: number;
}