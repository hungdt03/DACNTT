import { UserResource } from "./user";

export type StatisticResource = {
    countGroups: number;
    countPosts: number;
    countUsers: number;
    countOfflineUsers: number;
    countOnlineUsers: number;
    countConnections: number;
    countReports: number;
    top10UserScores: UserScore[];
    top5Followers: UserFollow[];
}

export interface UserScore {
    score: number;
    user: UserResource;
}

export interface UserFollow {
    follow: number;
    user: UserResource;
}