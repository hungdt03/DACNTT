import { Avatar, Button, Divider, Dropdown, MenuProps, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, useEffect, useState } from "react";
import images from "../../../assets";
import { CloseOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import { GroupPrivacy } from "../../../enums/group-privacy";
import { FriendResource } from "../../../types/friend";
import friendService from "../../../services/friendService";
import UploadButton from "../../uploads/UploadButton";
import { getBase64 } from "../../../utils/file";
import { RcFile } from "antd/es/upload";
import groupService from "../../../services/groupService";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../features/slices/auth-slice";

export type CreateGroupForm = {
    name: string;
    description: string;
    privacy: GroupPrivacy;
    inviteFriends: FriendResource[];
    coverImage?: UploadFile;
    coverUrl: string;
}

type CreateGroupSidebarProps = {
    onChange?: (values: CreateGroupForm) => void;
}

const CreateGroupSidebar: FC<CreateGroupSidebarProps> = ({
    onChange
}) => {
    const [friends, setFriends] = useState<FriendResource[]>([]);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const { user } = useSelector(selectAuth)

    const [values, setValues] = useState<CreateGroupForm>({
        description: '',
        inviteFriends: [],
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

    const handleInviteFriendsChange = (friend: FriendResource) => {
        const findIndex = values.inviteFriends.findIndex(fr => fr.id === friend.id);
        if (findIndex === -1) {
            const updateValues = {
                ...values,
                'inviteFriends': [...values.inviteFriends, friend],
            }

            setFriends(prev => ([
                ...prev.filter(item => item.id !== friend.id)
            ]))

            setValues(updateValues);
            onChange?.(updateValues)
        }
    }

    const handleRemoveInviteFriendsChange = (friend: FriendResource) => {
        const updateValues = {
            ...values,
            'inviteFriends': [...values.inviteFriends.filter(v => v.id !== friend.id)],
        }

        setFriends(prev => ([
            friend,
            ...prev,
        ]))

        setValues(updateValues);
        onChange?.(updateValues)
    }

    const handleUploadChange: UploadProps['onChange'] = async (info) => {
        const url = await getBase64(info.file as RcFile)
        const updateValues = {
            ...values,
            coverImage: info.file,
            coverUrl: url
        }

        setValues(updateValues);
        onChange?.(updateValues);
    };

    const fetchFriends = async () => {
        const response = await friendService.getAllMyFriends();
        if (response.isSuccess) {
            setFriends(response.data)
        }
    }

    useEffect(() => {
        fetchFriends()
    }, [])

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
                inviteFriends: [],
                name: '',
                privacy: GroupPrivacy.PUBLIC,
                coverUrl: ''
            })
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

    const menuFriends: MenuProps['items'] = friends.map(friend => ({
        key: friend.id,
        label: (
            <button onClick={() => handleInviteFriendsChange(friend)} className="py-1 text-[16px] flex items-center gap-x-2">
                <Avatar src={friend.avatar} />
                <span>{friend.fullName}</span>
            </button>
        ),
    }))


    return <div className="relative h-full col-span-3 shadow overflow-hidden">
        <div className="flex items-center gap-x-2 p-3">
            <Link to='/' className="p-2 w-9 h-9 flex items-center justify-center rounded-full text-white bg-gray-300">
                <CloseOutlined />
            </Link>
            <Link to='/'><img width='36px' height='36px' src={images.facebook} /></Link>
        </div>
        <Divider className="my-0" />
        <div className="p-3 flex flex-col gap-y-6 h-full overflow-hidden">
            <span className="font-bold text-2xl">Tạo nhóm</span>

            <div className="flex items-center gap-x-2">
                <Avatar size='large' src={images.user} />
                <div className="flex flex-col">
                    <span className="font-bold">{user?.fullName}</span>
                    <span className="text-gray-500 text-xs">Quản trị viên</span>
                </div>
            </div>
            <Divider className="my-0" />
            <div className="flex flex-col h-[60%] gap-y-4 overflow-y-auto custom-scrollbar">
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
                    {values.privacy && <div className="flex items-center gap-x-1 text-sm">
                        <span>Đã chọn:</span>
                        <span className="font-bold">{values.privacy}</span>
                    </div>}
                </div>
                <div className="flex flex-col gap-y-1">
                    <span className="font-semibold pl-1 text-gray-700">Mời bạn bè (Không bắt buộc)</span>
                    <Dropdown menu={{ items: menuFriends }} placement="bottom">
                        <button className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Chọn bạn bè</button>
                    </Dropdown>
                    {values.inviteFriends.length > 0 && <div className="flex flex-col gap-y-2 w-full">
                        <span className="text-xs font-semibold text-gray-500 px-1">Đã chọn</span>
                        <div className="flex items-center gap-2 flex-wrap w-full p-2 rounded-md border-[1px] border-gray-200 max-h-[250px] overflow-y-auto custom-scrollbar">
                            {values.inviteFriends.map(friend => <button key={friend.id} className="flex gap-x-2 items-center p-1 px-2 rounded-md bg-sky-100 text-primary font-semibold">
                                <span>{friend.fullName}</span>
                                <CloseOutlined onClick={() => handleRemoveInviteFriendsChange(friend)} className="text-xs font-bold" />
                            </button>)}
                        </div>
                    </div>}
                </div>
            </div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 shadow border-t-[1px] bg-white z-10 border-gray-100 px-3 py-4">
            <Button className="w-full" onClick={handleSubmit} type="primary" loading={loading} disabled={disabled || loading}>Tạo</Button>
        </div>
    </div>
};

export default CreateGroupSidebar;
