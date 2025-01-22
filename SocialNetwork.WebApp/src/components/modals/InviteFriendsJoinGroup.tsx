import { Avatar, Button, Divider } from "antd";
import { CheckCheck, Search, X } from "lucide-react";
import { FC } from "react";
import images from "../../assets";

const InviteFriendsJoinGroup: FC = () => {
    return <div className="max-h-[500px] h-[500px]">
        <Divider className="my-0" />
        <div className="grid grid-cols-3 h-full">
            <div className="col-span-2 p-2 flex flex-col gap-y-2 h-full overflow-y-hidden">
                <div className="px-3 py-1 bg-gray-100 flex items-center gap-x-1 rounded-3xl overflow-hidden">
                    <Search size={16} className="text-gray-500" />
                    <input placeholder="Tìm kiếm bạn bè theo tên" className="bg-gray-100 outline-none px-2 py-2 w-full h-full" />
                </div>

                <div className="pl-2 flex flex-col gap-y-2 h-full overflow-y-auto custom-scrollbar">
                    <span className="text-sm uppercase font-semibold text-gray-500">Gợi ý</span>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>


                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div><div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-x-2">
                                <Avatar size={'default'} src={images.user} />
                                <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                            </div>

                            <Button type='primary' icon={<CheckCheck />}>Mời</Button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="col-span-1 bg-slate-100 p-2 flex flex-col gap-y-2 h-full overflow-y-auto custom-scrollbar">
                <span className="text-xs uppercase font-semibold text-gray-500">Đã chọn 0 người bạn</span>

                <div className="flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>

                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Avatar size={'default'} src={images.user} />
                            <span className="text-[14px] text-gray-600 font-semibold">Nguyễn Khánh Hưng</span>
                        </div>

                        <X size={16} className="text-gray-500" />
                    </div>

                </div>
            </div>
        </div>
        <Divider className="my-0" />
    </div>
};

export default InviteFriendsJoinGroup;
