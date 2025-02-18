import { FC, useEffect, useState } from "react";
import { BriefcaseBusiness, Cake, DotSquareIcon, GraduationCap, Home, Mail, MapPin, MessageCircleCode, Phone, School, Workflow } from "lucide-react";
import { UserResource } from "../../../types/user";
import { UserSchoolResource } from "../../../types/userSchool";
import userService from "../../../services/userService";
import { EducationStatus } from "../../../enums/education-status";
import { LocationResource } from "../../../types/location";
import { UserWorkPlaceResource } from "../../../types/userWorkPlace";
import { formatDateStandard } from "../../../utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Gender } from "../../../enums/gender";
import { faMars, faMarsAndVenus, faVenus } from "@fortawesome/free-solid-svg-icons";
import { getGenderTitle } from "../../../utils/gender";

type UserPersonalInfoProps = {
    user: UserResource
}

const UserPersonalInfo: FC<UserPersonalInfoProps> = ({
    user
}) => {
    const [userSchools, setUserSchools] = useState<UserSchoolResource[]>([]);
    const [userWorkPlaces, setUserWorkPlaces] = useState<UserWorkPlaceResource[]>([]);
    const [currentLocation, setCurrentLocation] = useState<LocationResource | undefined>(undefined)
    const [userHometown, setUserHometown] = useState<LocationResource | undefined>(undefined)

    const fetchUserSchools = async () => {
        const response = await userService.getUserEducationByUserId(user.id);
        if (response.isSuccess) {
            setUserSchools(response.data)
        }
    }

    const fetchUserWorkPlaces = async () => {
        const response = await userService.getUserWorkPlaceByUserId(user.id);
        if (response.isSuccess) {
            setUserWorkPlaces(response.data)
        }
    }

    const fetchUserLocation = async () => {
        const response = await userService.getUserLocationByUserId(user.id);
        if (response.isSuccess) {
            setCurrentLocation(response.data)
        }
    }

    const fetchUserHometown = async () => {
        const response = await userService.getUserHometownByUserId(user.id);
        if (response.isSuccess) {
            setUserHometown(response.data)
        }
    }


    useEffect(() => {
        fetchUserSchools()
        fetchUserWorkPlaces()
        fetchUserHometown()
        fetchUserLocation()
    }, [user])

    return <div className="flex flex-col gap-y-4">
        {user.email && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
            <div className="flex items-center gap-x-3">
                <Mail className="flex-shrink-0 text-gray-400" size={20} />
                <span>{user.email}</span>
            </div>
        </div>}
        {user.phoneNumber && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
            <div className="flex items-center gap-x-3">
                <Phone className="flex-shrink-0 text-gray-400" size={20} />
                <span>{user.phoneNumber}</span>
            </div>
        </div>}
        {user.dateOfBirth && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
            <div className="flex items-center gap-x-3">
                <Cake className="flex-shrink-0 text-gray-400" size={20} />
                <span>{formatDateStandard(new Date(user.dateOfBirth))}</span>
            </div>
        </div>}
        {user.gender && <div className="flex flex-col gap-y-3 text-[14px] md:text-[16px]">
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
};

export default UserPersonalInfo;
