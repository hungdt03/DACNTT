import { Role } from "../enums/role";

export interface UserResource {
    id: string;
    fullName: string;
    email: string;
    bio: string;
    avatar: string;
    coverImage: string;
    gender: string;
    phoneNumber: string;
    dateOfBirth: Date;
    isOnline: boolean;
    postCount: number;
    followerCount: number;
    followingCount: number;
    friendCount: number;
    haveStory: boolean;
    isDeleted: boolean;
    isverification : boolean;
    location: string;
    dateJoined: Date;
    role: Role
}