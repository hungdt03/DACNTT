import { FC, useState } from "react";
import images from "../assets";
import { CaseSensitive, Images } from "lucide-react";
import CreateStorySidebar from "../components/story/CreateStorySidebar";

const CreateStoryPage: FC = () => {
    const [isText, setIsText] = useState(true)
    return <div className="h-screen w-screen grid grid-cols-12 gap-4">
        <div className="col-span-3">
            <CreateStorySidebar />
        </div>
        <div className="col-span-9 flex items-center justify-center">
            <div className="flex items-center gap-x-6">
                <div style={{
                    backgroundImage: `url(${images.bgStoryText})`,
                    backgroundPosition: '0px 0px',
                    backgroundSize: 'auto'
                }} className="px-6 flex items-center justify-center w-[220px] h-[330px] bg-no-repeat">
                    <div className="flex flex-col gap-y-2 items-center">
                        <div className="p-2 rounded-full bg-white border-[1px] border-gray-100 shadow">
                            <Images />
                        </div>
                        <span className="font-semibold text-white">Tạo tin dạng ảnh</span>
                    </div>
                </div>

                <div style={{
                    backgroundImage: `url(${images.bgStoryImage})`,
                    backgroundPosition: '0px -331px',
                    backgroundSize: 'auto'
                }} className="px-6 flex items-center justify-center w-[220px] h-[330px] bg-no-repeat">
                    <div className="flex flex-col gap-y-2 items-center">
                        <div className="p-2 rounded-full bg-white border-[1px] border-gray-100 shadow">
                            <CaseSensitive />
                        </div>
                        <span className="font-semibold text-white">Tạo tin dạng văn bản</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
};

export default CreateStoryPage;
