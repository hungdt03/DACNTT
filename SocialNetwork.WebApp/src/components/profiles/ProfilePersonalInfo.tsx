import { FC, useEffect, useState } from "react";
import { Edit3, Home, LocateIcon, School } from "lucide-react";
import useModal from "../../hooks/useModal";
import { Modal } from "antd";
import ModifyUserEducation from "../modals/ModifyUserEducation";
import { UserResource } from "../../types/user";
import { UserSchoolResource } from "../../types/userSchool";
import userService from "../../services/userService";
import { EducationStatus } from "../../enums/education-status";

type ProfilePersonalInfoProps = {
    user: UserResource
}

const ProfilePersonalInfo: FC<ProfilePersonalInfoProps> = ({
    user
}) => {
    const { isModalOpen, showModal, handleCancel, handleOk } = useModal();
    const { isModalOpen: openEducation, showModal: showEducation, handleCancel: cancelEducation, handleOk: okEducation } = useModal();
    const { isModalOpen: openHometown, showModal: showHometown, handleCancel: cancelHometown, handleOk: okHomeTown } = useModal();

    
    const [userSchools, setUserSchools] = useState<UserSchoolResource[]>([]);

    const fetchUserSchools = async () => {
        const response = await userService.getUserEducation();
        if (response.isSuccess) {
            setUserSchools(response.data)
        }
    }


    useEffect(() => {
        fetchUserSchools()
    }, [user])

    return <>
        <div className="flex flex-col gap-y-3">
            {userSchools.map(userSchool => <div key={userSchool.id} className="flex items-center gap-x-3">
                <School size={20} />
                <div className="flex items-center">
                    <div className="flex items-center gap-x-1">
                        {userSchool.status === EducationStatus.GRADUATED ? 'Đã học' : 'Đang học'} tại <span className="font-bold">{userSchool.school.name}</span>
                        <Edit3 onClick={showEducation} size={12} className="ml-1 cursor-pointer" />
                    </div>
                </div>
            </div>)}

            <div className="flex items-center gap-x-3">
                <Home size={20} />
                <div className="flex items-center">
                    <span className="flex items-center">
                        Sống tại Thành phố Hồ Chí Minh
                        <Edit3 onClick={showHometown} size={12} className="ml-1 cursor-pointer" />
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <LocateIcon size={20} />
                <div className="flex items-center">
                    <span className="flex items-center">
                        Đến từ Bà Rịa Vũng Tàu, Việt Nam
                        <Edit3 onClick={showModal} size={12} className="ml-1 cursor-pointer" />
                    </span>
                </div>
            </div>

        </div>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center font-semibold text-xl">CẬP NHẬT THÔNG TIN HỌC VẤN</p>}
            width='800px'
            open={openEducation}
            onOk={okEducation}
            onCancel={cancelEducation}
            classNames={{
                footer: 'hidden'
            }}
        >
            <ModifyUserEducation userSchools={userSchools} />
        </Modal>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center font-semibold text-xl">CẬP NHẬT THÔNG TIN NƠI SỐNG</p>}
            width='500px'
            open={openHometown}
            onOk={okHomeTown}
            onCancel={cancelHometown}
            classNames={{
                footer: 'hidden'
            }}
        >
            {/* <ModifyUserEducation /> */}
        </Modal>

        <Modal
            style={{ top: 50 }}
            title={<p className="text-center font-semibold text-xl">CẬP NHẬT THÔNG TIN NƠI LÀM VIỆC</p>}
            width='500px'
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            classNames={{
                footer: 'hidden'
            }}
        >
            {/* <ModifyUserEducation /> */}
        </Modal>
    </>
};

export default ProfilePersonalInfo;
