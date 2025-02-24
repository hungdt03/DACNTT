import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import { Divider, Tabs } from "antd";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { formatDateStandard } from "../../../utils/date";
import adminImages from "../../../assets/adminImage";
import UserFriendTabs from "./UserFriendTabs";
import { UserResource } from "../../../types/user";
import images from "../../../assets";
import UserFollowerTabs from "./UserFollowerTabs";
import UserFolloweeTabs from "./UserFolloweeTabs";
import UserPostTabs from "./UserPostTabs";
import userService from "../../../services/userService";
import { UserSchoolResource } from "../../../types/userSchool";
import { UserWorkPlaceResource } from "../../../types/userWorkPlace";
import { LocationResource } from "../../../types/location";
import { BriefcaseBusiness, Cake, GraduationCap, Home, Mail, MapPin, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faMarsAndVenus, faVenus } from "@fortawesome/free-solid-svg-icons";
import { Gender } from "../../../enums/gender";
import { getGenderTitle } from "../../../utils/gender";
import { EducationStatus } from "../../../enums/education-status";

const UserDetailPage: FC = () => {
    const [user, setUser] = useState<UserResource>();
    const [loading, setLoading] = useState(false)
    const { userId } = useParams();

    const [userSchools, setUserSchools] = useState<UserSchoolResource[]>([]);
    const [userWorkPlaces, setUserWorkPlaces] = useState<UserWorkPlaceResource[]>([]);
    const [currentLocation, setCurrentLocation] = useState<LocationResource | undefined>(undefined)
    const [userHometown, setUserHometown] = useState<LocationResource | undefined>(undefined)

    const fetchUserSchools = async () => {
        if (userId) {
            const response = await userService.getUserEducationByUserId(userId);
            if (response.isSuccess) {
                setUserSchools(response.data)
            }
        }
    }

    const fetchUserWorkPlaces = async () => {
        if (userId) {
            const response = await userService.getUserWorkPlaceByUserId(userId);
            if (response.isSuccess) {
                setUserWorkPlaces(response.data)
            }
        }

    }

    const fetchUserLocation = async () => {
        if (userId) {
            const response = await userService.getUserLocationByUserId(userId);
            if (response.isSuccess) {
                setCurrentLocation(response.data)
            }
        }
    }

    const fetchUserHometown = async () => {
        if (userId) {
            const response = await userService.getUserHometownByUserId(userId);
            if (response.isSuccess) {
                setUserHometown(response.data)
            }
        }
    }


    useEffect(() => {
        fetchUserSchools()
        fetchUserWorkPlaces()
        fetchUserHometown()
        fetchUserLocation()
    }, [user])

    const fetchUser = async () => {
        if (userId) {
            setLoading(true)
            const response = await adminService.getUserById(userId);
            setLoading(false)
            if (response.isSuccess) {
                setUser(response.data)
            }
        }
    }

    useEffect(() => {
        fetchUser()
    }, [userId])

    return loading ? <LoadingIndicator title="Đang tải dữ liệu người dùng" /> : <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
            <div className="grid grid-cols-4 gap-4">
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={images.friend} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.friendCount}</span>
                        <span>Bạn bè</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={adminImages.post} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.postCount}</span>
                        <span>Bài viết</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={50} src={images.follower} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.followerCount}</span>
                        <span>Người theo dõi</span>
                    </div>
                </div>
                <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                    <img width={40} src={images.followee} />
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold">{user?.followingCount}</span>
                        <span>Đang theo dõi</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-y-4 col-span-4 shadow bg-white rounded-md p-4">
            <div className="flex flex-col">
                <img
                    style={{
                        aspectRatio: 3 / 1
                    }}
                    className="object-cover rounded-md"
                    src={user?.coverImage}
                />

                <div className="-mt-5 flex justify-center">
                    <img className="w-16 rounded-full h-16 object-cover border-1" src={user?.avatar} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-y-2">
                <span className="text-xl font-bold">{user?.fullName}</span>
                <p className="text-sm text-gray-600 line-clamp-3">{user?.bio ?? 'Chưa cập nhật'}</p>
            </div>
            <Divider className="my-0" />
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Ngày tham gia</span>
                    <span className="text-sm text-gray-600">{formatDateStandard(new Date(user?.dateJoined!))}</span>
                </div>
            </div>
            {user?.email && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
                <div className="flex items-center gap-x-3">
                    <Mail className="flex-shrink-0 text-gray-400" size={20} />
                    <span>{user.email}</span>
                </div>
            </div>}
            {user?.phoneNumber && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
                <div className="flex items-center gap-x-3">
                    <Phone className="flex-shrink-0 text-gray-400" size={20} />
                    <span>{user.phoneNumber}</span>
                </div>
            </div>}
            {user?.dateOfBirth && formatDateStandard(new Date(user.dateOfBirth)) !== '01/01/1' && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
                <div className="flex items-center gap-x-3">
                    <Cake className="flex-shrink-0 text-gray-400" size={20} />
                    <span>{formatDateStandard(new Date(user.dateOfBirth))}</span>
                </div>
            </div>}
            {user?.gender && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
                <div className="flex items-center gap-x-3">
                    <FontAwesomeIcon
                        icon={user.gender === Gender.MALE ? faMars : user.gender === Gender.FEMALE ? faVenus : faMarsAndVenus}
                        className="text-gray-400"
                        size="lg"
                    />
                    <span>
                        {getGenderTitle(user.gender as Gender)}
                    </span>
                </div>
            </div>}
            {userSchools.length > 0 && <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-3 text-gray-700">
                    {userSchools.map(userSchool => <div key={userSchool.id} className="flex items-center gap-x-3 text-[14px] md:text-[16px]">
                        <GraduationCap className="flex-shrink-0 text-gray-400" size={20} />
                        <div>
                            <span>
                                {userSchool.status === EducationStatus.GRADUATED ? 'Đã học ' : 'Đang học '}
                            </span>
                            <span className="font-bold">
                                {userSchool?.major?.name}
                            </span>
                            <span>
                                {' tại '}
                            </span>
                            <span className="font-bold">
                                {userSchool.school.name}
                            </span>

                        </div>

                    </div>)}
                </div>
            </div>}

            {userWorkPlaces.length > 0 && <div className="flex flex-col gap-y-3">

                <div className="flex flex-col gap-y-3 text-gray-700 text-[14px] md:text-[16px]">
                    {userWorkPlaces.map(workPlace => <div key={workPlace.id} className="flex items-center gap-x-3">
                        <BriefcaseBusiness className="flex-shrink-0 text-gray-400" size={20} />
                        <div>
                            <span>
                                {workPlace.isCurrent ? 'Đang làm ' : 'Từng làm '}
                            </span>
                            <span className="font-bold">
                                {workPlace?.position?.name}
                            </span>
                            <span>
                                {' tại '}
                            </span>
                            <span className="font-bold">
                                {workPlace?.company.name}
                            </span>
                        </div>
                    </div>)}
                </div>
            </div>}

            {currentLocation && <div className="flex items-center gap-x-3 text-gray-700 text-[14px] md:text-[16px]">
                <Home size={20} className="text-gray-400" />
                <span>
                    <span>{' Sống tại '}</span>
                    <span className="font-bold">{currentLocation.address + ' '}</span>
                </span>
            </div>}
            {userHometown && <div className="flex items-center gap-x-3 text-gray-700 text-[14px] md:text-[16px]">
                <MapPin className="text-gray-400" size={20} />
                <span>
                    <span>{' Đến từ '}</span>
                    <span className="font-bold">{userHometown.address + ' '}</span>
                </span>
            </div>}
        </div>

        <div className="col-span-8 bg-white p-4 rounded-md shadow">
            <Tabs
                items={[
                    {
                        key: 'posts',
                        label: 'Bài viết',
                        children: userId ? <UserPostTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'friends',
                        label: 'Bạn bè',
                        children: userId ? <UserFriendTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'followers',
                        label: 'Người theo dõi',
                        children: userId ? <UserFollowerTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    },
                    {
                        key: 'followees',
                        label: 'Đang theo dõi',
                        children: userId ? <UserFolloweeTabs userId={userId} /> : <LoadingIndicator title="Đang tải dữ liệu" />
                    }
                ]}
            />
        </div>
    </div>
};

export default UserDetailPage;
