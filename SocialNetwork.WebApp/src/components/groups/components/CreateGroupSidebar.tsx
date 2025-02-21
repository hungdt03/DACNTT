import { Avatar, Button, Divider, Dropdown, MenuProps, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, useState } from "react";
import images from "../../../assets";
import { CloseOutlined } from '@ant-design/icons'
import { Link, useNavigate } from "react-router-dom";
import { GroupPrivacy } from "../../../enums/group-privacy";
import UploadButton from "../../uploads/UploadButton";
import { getBase64, isValidImage } from "../../../utils/file";
import { RcFile } from "antd/es/upload";
import groupService from "../../../services/groupService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";
import { getGroupPrivacyTitle } from "../../../utils/privacy";

export type CreateGroupForm = {
    name: string;
    description: string;
    privacy: GroupPrivacy;
    coverImage?: UploadFile;
    coverUrl: string;
}

type CreateGroupSidebarProps = {
    onChange?: (values: CreateGroupForm) => void;
    showHeader?: boolean;
}

const CreateGroupSidebar: FC<CreateGroupSidebarProps> = ({
    onChange,
    showHeader = true
}) => {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate()

    const { user } = useSelector(selectAuth)

    const [values, setValues] = useState<CreateGroupForm>({
        description: '',
        name: '',
        privacy: GroupPrivacy.PUBLIC,
        coverUrl: ''
    })

    const handleChange = (name: keyof CreateGroupForm, value: any) => {
        const updateValues = {
            ...values,
            [name]: value,
        }

        setValues(updateValues);
        onChange?.(updateValues);
        setDisabled(false)
    };

    const handleUploadChange: UploadProps['onChange'] = async (info) => {
        if (!isValidImage(info.file as RcFile)) {
            message.error('Vui lòng chọn file ảnh')
            return;
        } else {
            const totalSize = (info.file as RcFile).size;
            const maxSize = 4 * 1024 * 1024;

            if (totalSize > maxSize) {
                message.error("Vui lòng chọn file ảnh tối đa 4MB");
                return;
            }
        }

        const url = await getBase64(info.file as RcFile)
        const updateValues = {
            ...values,
            coverImage: info.file,
            coverUrl: url
        }

        setValues(updateValues);
        onChange?.(updateValues);
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', values.name)
        formData.append('description', values.description)
        formData.append('privacy', values.privacy)
        formData.append('coverImage', values.coverImage as RcFile);

        setLoading(true)
        const response = await groupService.createGroup(formData);
        setLoading(false)
        if (response.isSuccess) {
            message.success(response.message)
            setValues({
                description: '',
                name: '',
                privacy: GroupPrivacy.PUBLIC,
                coverUrl: ''
            })

            navigate(`/groups/${response.data}`)
        } else {
            message.error(response.message)
        }
    }

    const items: MenuProps['items'] = [
        {
            key: GroupPrivacy.PUBLIC,
            label: (
                <button onClick={() => handleChange('privacy', GroupPrivacy.PUBLIC)} className="py-1 text-[16px] w-full text-left">Công khai</button>
            ),
        },
        {
            key: GroupPrivacy.PRIVATE,
            label: (
                <button onClick={() => handleChange('privacy', GroupPrivacy.PRIVATE)} className="py-1 text-[16px] w-full text-left">Riêng tư</button>
            ),
        },
    ];

    return <div className="h-full relative overflow-y-auto custom-scrollbar">
        {showHeader && <>
            <div className="flex items-center gap-x-2 p-3">
                <Link to='/' className="p-2 w-9 h-9 flex items-center justify-center rounded-full text-white bg-gray-400">
                    <CloseOutlined />
                </Link>
                <Link to='/'><img alt="Logo ứng dụng" width='36px' height='36px' src={images.facebook} /></Link>
            </div> <Divider className="my-0" />
        </>}

        <div className="p-3 flex flex-col gap-y-6 h-full">
            {showHeader && <span className="font-bold text-2xl">Tạo nhóm</span>}

            <div className="flex items-center gap-x-2">
                <Avatar size='large' src={user?.avatar ?? images.user} />
                <div className="flex flex-col">
                    <span className="font-bold">{user?.fullName}</span>
                    <span className="text-gray-500 text-xs">Quản trị viên</span>
                </div>
            </div>
            <Divider className="my-0" />
            <div className="flex flex-col h-full gap-y-4 pb-4">
                <div className="flex flex-col justify-center">
                    <span className="font-semibold pl-1 text-gray-700">Ảnh bìa</span>
                    <div className="flex justify-center">
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={_ => false}
                            onChange={handleUploadChange}
                        >
                            {values.coverUrl ? <img src={values.coverUrl} className="rounded-full object-cover w-[100px] h-[100px]" alt="avatar" /> : <UploadButton />}
                        </Upload>
                    </div>
                </div>
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold pl-1 text-gray-700">Tên nhóm</span>
                    <input value={values.name} onChange={e => handleChange('name', e.target.value)} className="w-full px-3 py-2 rounded-md outline-none border-[1px] border-gray-200" placeholder="Tên nhóm" />
                </div>
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold pl-1 text-gray-700">Mô tả ngắn</span>
                    <textarea value={values.description} onChange={e => handleChange('description', e.target.value)} className="w-full px-3 py-2 rounded-md outline-none border-[1px] border-gray-200" placeholder="Mô tả ngắn">
                    </textarea>
                </div>
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold pl-1 text-gray-700">Quyền riêng tư</span>
                    <Dropdown menu={{ items }} placement="bottom">
                        <button className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Chọn quyền riêng tư</button>
                    </Dropdown>
                    {values.privacy && <div className="flex flex-col gap-y-1">
                        <div className="flex items-center gap-x-1 text-sm">
                            <span>Đã chọn:</span>
                            <span className="font-bold">{getGroupPrivacyTitle(values.privacy)}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            {values.privacy === GroupPrivacy.PUBLIC ? 'Sau này bạn có thể chuyển từ Công khai sang Riêng tư' : 'Sau này bạn không thể chuyển từ Riêng tư sang Công khai vì để đảm bảo cho quyền riêng tư cho các thành viên khác'}
                        </p>
                    </div>}
                </div>
            </div>
        </div>

        <div className="sticky left-0 right-0 bottom-0 shadow border-t-[1px] bg-white z-10 border-gray-100 px-3 py-4">
            <Button className="w-full" onClick={handleSubmit} type="primary" loading={loading} disabled={disabled}>Tạo</Button>
        </div>
    </div>
};

export default CreateGroupSidebar;
