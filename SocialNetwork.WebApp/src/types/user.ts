export interface UserResource {
    id: string;
    fullName: string;
    avatar: string;
    gender: string;
    phoneNumber: string;
    dateOfBirth: Date;

    postCount: number;
    followerCount: number;
    followingCount: number;
    friendCount: number;
}