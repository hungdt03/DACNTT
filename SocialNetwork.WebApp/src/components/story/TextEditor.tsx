import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, MenuProps } from "antd";
import { CaseSensitive } from "lucide-react";
import { FC } from "react";
import dataBackgroundStory from '../../data/data-background-story.json'
import cn from "../../utils/cn";

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <span className="px-2 py-4">Gọn gàng</span>
        ),
    },
    {
        key: '2',
        label: (
            <span className="px-2 py-4">Bình thường</span>
        ),
    },
    {
        key: '3',
        label: (
            <span className="px-2 py-4">Kiểu cách</span>
        ),
    },
    {
        key: '4',
        label: (
            <span className="px-2 py-4">Tiêu đề</span>
        ),
    },
];


const TextEditor: FC = () => {
    return <div className="flex flex-col gap-y-4 w-full">
        <textarea className="outline-none border-[1px] border-gray-300 p-2 rounded-md" placeholder="Bắt đầu nhập" rows={4}></textarea>

        <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <button className="flex items-center justify-between p-3 rounded-md border-[1px] border-gray-300">
                <div className="flex items-center gap-x-2">
                    <CaseSensitive className="text-gray-600" />
                    <span className="text-gray-600">Gọn gàng</span>
                </div>

                <FontAwesomeIcon className="text-gray-600" icon={faCaretDown} />
            </button>
        </Dropdown>
        <div className="p-2 flex flex-col gap-y-2 border-[1px] border-gray-300 rounded-md">
            <span className="text-gray-400">Phông nền</span>
            <div className="flex items-center gap-2 flex-wrap">
                {dataBackgroundStory.map(item => <div style={{
                    background: item.background
                }} key={item.name} className={`w-6 h-6 rounded-full`}></div>)}
            </div>
        </div>
    </div>
};

export default TextEditor;
