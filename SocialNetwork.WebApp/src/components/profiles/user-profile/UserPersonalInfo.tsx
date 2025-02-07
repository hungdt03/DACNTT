import { FC, useEffect, useState } from "react";
import { BriefcaseBusiness, DotSquareIcon, GraduationCap, Home, MapPin, School, Workflow } from "lucide-react";
import { UserResource } from "../../../types/user";
import { UserSchoolResource } from "../../../types/userSchool";
import userService from "../../../services/userService";
import { EducationStatus } from "../../../enums/education-status";
import { LocationResource } from "../../../types/location";
import { UserWorkPlaceResource } from "../../../types/userWorkPlace";

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
        <div className="flex flex-col gap-y-3">
            <span className="font-bold">Học vấn</span>
            {userSchools.length > 0 && <div className="flex flex-col gap-y-3 pl-4 text-gray-700">
                {userSchools.map(userSchool => <div key={userSchool.id} className="flex items-center gap-x-3">
                    <GraduationCap className="flex-shrink-0 text-gray-400" size={16} />
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
            </div>}
        </div>

        <div className="flex flex-col gap-y-3">
            <span className="font-bold">Làm việc</span>

            {userWorkPlaces.length > 0 && <div className="flex flex-col gap-y-3 pl-4 text-gray-700">
                {userWorkPlaces.map(workPlace => <div key={workPlace.id} className="flex items-center gap-x-3">
                    <BriefcaseBusiness className="flex-shrink-0 text-gray-400" size={16} />
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
            </div>}
        </div>

        {currentLocation ? <div className="flex items-center gap-x-3 text-gray-700">
            <Home size={20} className="text-gray-400" />
            <span>
                <span>{' Sống tại '}</span>
                <span className="font-bold">{currentLocation.address + ' '}</span>
            </span>
        </div> : <div className="flex items-center gap-x-2">
            <span className="font-bold">Nơi sống hiện tại</span>
        </div>}

        {userHometown ? <div className="flex items-center gap-x-3 text-gray-700">
            <MapPin className="text-gray-400" size={20} />
            <span>
                <span>{' Đến từ '}</span>
                <span className="font-bold">{userHometown.address + ' '}</span>
            </span>
        </div> : <div className="flex items-center gap-x-2">
            <span className="font-bold">Quê quán</span>
        </div>}
    </div>
};

export default UserPersonalInfo;
