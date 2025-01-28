import { FC, useEffect, useState } from "react";
import { DotSquareIcon, Home, School, Workflow } from "lucide-react";
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
            <div className="flex items-center gap-x-2">
                <School size={20} />
                <span >Học vấn</span>
            </div>
            {userSchools.length > 0 && <div className="flex flex-col gap-y-3 pl-4">
                {userSchools.map(userSchool => <div key={userSchool.id} className="flex items-center gap-x-3">
                    <DotSquareIcon className="flex-shrink-0" size={16} />
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
            <div className="flex items-center gap-x-2">
                <Workflow size={20} />
                <span>Làm việc</span>
            </div>

            {userWorkPlaces.length > 0 && <div className="flex flex-col gap-y-3 pl-4">
                {userWorkPlaces.map(workPlace => <div key={workPlace.id} className="flex items-center gap-x-3">
                    <DotSquareIcon className="flex-shrink-0" size={16} />
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

        {currentLocation ? <div className="flex items-center gap-x-3">
            <Home size={20} />
            <span>
                <span>{' Sống tại '}</span>
                <span className="font-bold">{currentLocation.address + ' '}</span>
            </span>
        </div> : <div className="flex items-center gap-x-2">
            <School size={20} />
            <span className="font-bold">Nơi sống hiện tại</span>
        </div>}

        {userHometown ? <div className="flex items-center gap-x-3">
            <Home size={20} />
            <span>
                <span>{' Đến từ '}</span>
                <span className="font-bold">{userHometown.address + ' '}</span>
            </span>
        </div> : <div className="flex items-center gap-x-2">
            <School size={20} />
            <span>Quê quán</span>
        </div>}
    </div>
};

export default UserPersonalInfo;
