import { FC, useEffect, useState } from "react";
import { BriefcaseBusiness, Cake, ChartArea, Delete, Edit3, GraduationCap, Home, Mail, MapPin, MessageCircleCode, Phone, Plus } from "lucide-react";
import useModal from "../../../hooks/useModal";
import { Modal, message } from "antd";
import ModifyUserEducation from "../../modals/ModifyUserEducation";
import { UserResource } from "../../../types/user";
import { UserSchoolResource } from "../../../types/userSchool";
import userService from "../../../services/userService";
import { EducationStatus } from "../../../enums/education-status";
import { LocationResource } from "../../../types/location";
import ModifyUserLocation from "../../modals/ModifyUserLocation";
import ModifyUserHometown from "../../modals/ModifyUserHometown";
import { UserWorkPlaceResource } from "../../../types/userWorkPlace";
import ModifyUserWorkPlace from "../../modals/ModifyUserWorkPlace";
import { Gender } from "../../../enums/gender";
import { getGenderTitle } from "../../../utils/gender";
import { formatDateStandard } from "../../../utils/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faMarsAndVenus, faVenus } from "@fortawesome/free-solid-svg-icons";

type MyPersonalInfoProps = {
    user: UserResource
}

const MyPersonalInfo: FC<MyPersonalInfoProps> = ({
    user
}) => {
    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();
    const { isModalOpen: openEducation, showModal: showEducation, handleCancel: cancelEducation, handleOk: okEducation } = useModal();
    const { isModalOpen: openHometown, showModal: showHometown, handleCancel: cancelHometown, handleOk: okHomeTown } = useModal();
    const { isModalOpen: openWorkPlace, showModal: showWorkPlace, handleCancel: cancelWorkPlace, handleOk: okWorkPlace } = useModal();

    const [userSchool, setUserSchool] = useState<UserSchoolResource | undefined>(undefined)
    const [userSchools, setUserSchools] = useState<UserSchoolResource[]>([]);

    const [userWorkPlace, setUserWorkPlace] = useState<UserWorkPlaceResource | undefined>(undefined)
    const [userWorkPlaces, setUserWorkPlaces] = useState<UserWorkPlaceResource[]>([]);

    const [currentLocation, setCurrentLocation] = useState<LocationResource | undefined>(undefined)
    const [userHometown, setUserHometown] = useState<LocationResource | undefined>(undefined)

    const fetchUserSchools = async () => {
        const response = await userService.getUserEducation();
        if (response.isSuccess) {
            setUserSchools(response.data)
        }
    }

    const fetchUserWorkPlaces = async () => {
        const response = await userService.getUserWorkPlace();
        if (response.isSuccess) {
            setUserWorkPlaces(response.data)
        }
    }

    const fetchUserLocation = async () => {
        const response = await userService.getUserLocation();
        if (response.isSuccess) {
            setCurrentLocation(response.data)
        }
    }

    const fetchUserHometown = async () => {
        const response = await userService.getUserHometown();
        if (response.isSuccess) {
            setUserHometown(response.data)
        }
    }

    const handleSelectUserSchool = (selected?: UserSchoolResource) => {
        setUserSchool(selected);
        showEducation()
    }

    const handleSelectUserWorlPlace = (selected?: UserWorkPlaceResource) => {
        setUserWorkPlace(selected);
        showWorkPlace()
    }

    const handleDeleteUserSchool = async (userSchoolId: string) => {
        const response = await userService.deleteUserEducation(userSchoolId);
        if (response.isSuccess) {
            fetchUserSchools()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    const handleDeleteUserWorkPlace = async (userWorkPlaceId: string) => {
        const response = await userService.deleteUserWorkPlace(userWorkPlaceId);
        if (response.isSuccess) {
            fetchUserWorkPlaces()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    useEffect(() => {
        fetchUserSchools()
        fetchUserWorkPlaces()
        fetchUserHometown()
        fetchUserLocation()
    }, [user])

    return <>
        <div className="flex flex-col gap-y-4">
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
            <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-3 text-[14px] md:text-[16px]">
                    <Cake className="flex-shrink-0 text-gray-400" size={20} />
                    <span>{formatDateStandard(new Date(user.dateOfBirth))}</span>
                </div>
            </div>
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
            <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-[15px] md:text-[16px] text-gray-700">Học vấn</span>
                    <button onClick={() => handleSelectUserSchool(undefined)} className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-sky-600 bg-primary">
                        <Plus size={16} className="text-white" />
                    </button>
                </div>
                {userSchools.length > 0 && <div className="flex flex-col gap-y-3 pl-4 text-gray-700 text-[14px] md:text-[16px]">
                    {userSchools.map(userSchool => <div key={userSchool.id} className="flex items-center gap-x-3">
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
                            <Edit3 onClick={() => handleSelectUserSchool(userSchool)} size={22} className="ml-2 inline cursor-pointer p-1 hover:bg-gray-100 rounded-full" />
                            <Delete onClick={() => handleDeleteUserSchool(userSchool.id)} size={22} className="text-red-500 ml-2 inline cursor-pointer p-1 hover:bg-gray-100 rounded-full" />
                        </div>

                    </div>)}
                </div>}
            </div>

            <div className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-[15px] md:text-[16px] text-gray-700">Làm việc</span>
                    <button onClick={() => handleSelectUserWorlPlace()} className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-sky-600 bg-primary">
                        <Plus size={16} className="text-white" />
                    </button>
                </div>
                {userWorkPlaces.length > 0 && <div className="flex flex-col gap-y-3 pl-4 text-gray-700 text-[14px] md:text-[16px]">
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
                            <Edit3 onClick={() => handleSelectUserWorlPlace(workPlace)} size={22} className="ml-2 inline cursor-pointer p-1 hover:bg-gray-100 rounded-full" />
                            <Delete onClick={() => handleDeleteUserWorkPlace(workPlace.id)} size={22} className="text-red-500 ml-2 inline cursor-pointer p-1 hover:bg-gray-100 rounded-full" />
                        </div>

                    </div>)}
                </div>}
            </div>


            {currentLocation ? <div className="flex items-center gap-x-3 text-[14px] md:text-[16px]">
                <Home size={20} className="text-gray-400" />
                <span>
                    <span>{' Sống tại '}</span>
                    <span className="font-bold">{currentLocation.address + ' '}</span>
                    <Edit3 onClick={showModal} size={22} className="inline cursor-pointer hover:bg-gray-100 rounded-full p-1" />
                </span>
            </div> : <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <span className="font-bold text-[15px] md:text-[16px] text-gray-700">Nơi sống hiện tại</span>
                </div>
                <button onClick={showModal} className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-sky-600 bg-primary">
                    <Plus size={16} className="text-white" />
                </button>
            </div>}

            {userHometown ? <div className="flex items-center gap-x-3 text-gray-700 text-[14px] md:text-[16px]">
                <MapPin size={20} className="text-gray-400" />
                <span>
                    <span>{' Đến từ '}</span>
                    <span className="font-bold">{userHometown.address + ' '}</span>
                    <Edit3 onClick={showHometown} size={12} className="inline cursor-pointer" />
                </span>
            </div> : <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <span className="font-bold text-[15px] md:text-[16px] text-gray-700">Quê quán</span>
                </div>
                <button onClick={showHometown} className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-sky-600 bg-primary">
                    <Plus size={16} className="text-white" />
                </button>
            </div>}

        </div>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">{userSchool ? 'CẬP NHẬT THÔNG TIN HỌC VẤN' : 'THÊM THÔNG TIN HỌC VẤN'}</p>}
            width='500px'
            open={openEducation}
            onOk={okEducation}
            onCancel={cancelEducation}
            classNames={{
                footer: 'hidden'
            }}
        >
            {openEducation && <ModifyUserEducation
                userSchool={userSchool}
                onFetch={() => {
                    okEducation();
                    fetchUserSchools()
                }}
            />}
        </Modal>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">{userSchool ? 'CẬP NHẬT THÔNG TIN VIỆC LÀM' : 'THÊM THÔNG TIN VIỆC LÀM'}</p>}
            width='500px'
            open={openWorkPlace}
            onOk={okWorkPlace}
            onCancel={cancelWorkPlace}
            classNames={{
                footer: 'hidden'
            }}
        >
            {openWorkPlace && <ModifyUserWorkPlace
                userWorkPlace={userWorkPlace}
                onFetch={() => {
                    okWorkPlace();
                    fetchUserWorkPlaces()
                }}
            />}
        </Modal>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">CẬP NHẬT THÔNG TIN QUÊ QUÁN</p>}
            width='500px'
            open={openHometown}
            onOk={okHomeTown}
            onCancel={cancelHometown}
            classNames={{
                footer: 'hidden'
            }}
        >
            {openHometown && <ModifyUserHometown
                userLocation={userHometown}
                onFetch={() => {
                    okHomeTown()
                    fetchUserHometown()
                }}
            />}
        </Modal>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center sm:font-bold font-semibold text-sm sm:text-lg">CẬP NHẬT THÔNG TIN NƠI SỐNG HIỆN TẠI</p>}
            width='500px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            classNames={{
                footer: 'hidden'
            }}
        >
            {isModalOpen && <ModifyUserLocation
                userLocation={currentLocation}
                onFetch={() => {
                    handleOk()
                    fetchUserLocation()
                }}
            />}
        </Modal>
    </>
};

export default MyPersonalInfo;
