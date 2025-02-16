import { FC } from "react";
import images from "../../../assets";
import { Earth, Image, Lock, User2 } from "lucide-react";
import { Avatar, Divider, Tooltip } from "antd";
import { CreateGroupForm } from "./CreateGroupSidebar";
import { getGroupPrivacyTitle } from "../../../utils/privacy";
import { GroupPrivacy } from "../../../enums/group-privacy";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type CreateGroupPreviewProps = {
    values: CreateGroupForm | undefined;
    onOpenDrawer: () => void
}

const CreateGroupPreview: FC<CreateGroupPreviewProps> = ({
    values,
    onOpenDrawer
}) => {
    return <div className="w-[85%] h-full mx-auto">
        <div className="p-4 flex flex-col h-full gap-y-5 rounded-lg shadow-2xl border-[1px] border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between">
                <Link to='/groups/feeds' className='block lg:hidden font-semibold text-xs py-1 px-2 rounded-md bg-gray-100'>
                    Quay lại
                </Link>
                <span className="font-bold">Xem trước</span>
                <button onClick={onOpenDrawer} className="hover:text-gray-600 text-gray-600 text-sm font-bold block lg:hidden hover:bg-gray-100 p-2 rounded-full">
                    <Bars3BottomRightIcon className="text-gray-500" width={20} />
                </button>
            </div>

            <div className="rounded-xl border-[1px] border-gray-200 h-full overflow-y-auto custom-scrollbar">
                <div style={{
                    aspectRatio: 14 / 5
                }}>
                    <img className="w-full h-full object-cover rounded-xl" src={values?.coverUrl ? values?.coverUrl : images.coverGroup} />
                </div>

                <div className="px-4 py-6 flex flex-col gap-y-2 bg-white shadow-xl">
                    <span className="text-xl font-bold">{values?.name ?? 'Tên nhóm'}</span>
                    <div className="flex items-center gap-x-2">
                        {values?.privacy && <>
                            {values.privacy === GroupPrivacy.PRIVATE ? <div className="flex items-center gap-x-2">
                                <Lock size={12} />
                                <span className="text-sm">Nhóm Riêng tư</span>
                            </div> : <div className="flex items-center gap-x-2">
                                <Earth size={12} />
                                <span className="text-sm">Nhóm Công khai</span>
                            </div>}
                        </>}
                        <span className="text-sm font-bold">1 thành viên</span>
                    </div>

                    <Divider className="my-2" />
                    <Tooltip title='Bạn có thể dùng tính năng này sau khi tạo Nhóm'>
                        <div className="flex items-center gap-x-6 px-4 text-gray-500 cursor-not-allowed">
                            <span className="font-semibold">Giới thiệu</span>
                            <span className="font-semibold">Bài viết</span>
                            <span className="font-semibold">Thành viên</span>
                        </div>
                    </Tooltip>
                </div>

                <div className="bg-slate-100 p-4 grid grid-cols-12 gap-4">
                    <div className="lg:col-span-7 col-span-12">
                        <Tooltip title='Bạn có thể dùng tính năng này sau khi tạo Nhóm'>
                            <div className="rounded-lg p-3 flex flex-col gap-y-2 bg-slate-50 shadow border-[1px] border-gray-50 cursor-not-allowed">
                                <div className="flex items-center gap-x-2 text-gray-400">
                                    <Avatar className="flex-shrink-0" />
                                    <div className="px-3 py-2 rounded-3xl bg-gray-100 flex-1">
                                        Bạn đang nghĩ gì?
                                    </div>
                                </div>

                                <div className="flex items-center gap-x-4 px-4">
                                    <div className="flex items-center gap-x-2 px-1 py-4 text-gray-400">
                                        <Image size={16} />
                                        <span>Ảnh/video</span>
                                    </div>
                                    <div className="flex items-center gap-x-2 px-1 py-4 text-gray-400">
                                        <User2 size={16} />
                                        Gắn thẻ người khác
                                    </div>
                                </div>
                            </div>
                        </Tooltip>
                    </div>
                    <div className="lg:col-span-5 col-span-12">
                        <div className="rounded-lg p-3 bg-white border-[1px] border-gray-200">
                            <span className="font-bold">Giới thiệu</span>

                            <div className="flex flex-col gap-y-2">
                                <div className="flex items-start gap-x-2">
                                    <Lock className="flex-shrink-0 inline-block mt-1" size={14} />
                                    <div className="flex flex-col gap-y-1">
                                        <span className="font-bold">Mô tả</span>
                                        <p>{values?.description ?? 'Mô tả về nhóm'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-x-2">
                                    {values?.privacy === GroupPrivacy.PRIVATE ? <Lock className="flex-shrink-0 inline-block mt-1" size={14} /> : <Earth className="flex-shrink-0 inline-block mt-1" size={14} />}
                                    <div className="flex flex-col gap-y-1">
                                        <span className="font-bold">{values?.privacy ? getGroupPrivacyTitle(values.privacy) : 'Quyền riêng tư'}</span>
                                        <p>Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default CreateGroupPreview;
