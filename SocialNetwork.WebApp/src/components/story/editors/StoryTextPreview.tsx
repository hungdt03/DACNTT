import { Button } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { BarsOutlined } from '@ant-design/icons'

type StoryTextPreviewProps = {
    content: string;
    background: string;
    fontFamily: string;
    onOpenTool: () => void;
}

type TextStoryExpand = 'expand' | 'collapse' | 'unknown';

const StoryTextPreview: FC<StoryTextPreviewProps> = ({
    onOpenTool,
    content,
    background,
    fontFamily = "'Noto Sans', sans-serif"
}) => {

    return <div className="w-[85%] h-[90%] flex flex-col gap-y-3 shadow-2xl border-[1px] border-gray-100 bg-white rounded-xl p-4">
        <div className="flex items-center justify-between">
            <span className="font-semibold">Xem trước</span>
            <Button className="flex lg:hidden" type="primary" icon={<BarsOutlined />} onClick={onOpenTool}>Công cụ</Button>
        </div>

        <div className="bg-gray-950 rounded-xl w-full h-full flex items-center justify-center">
            <div style={{
                aspectRatio: 9 / 16,
                background: background,
                fontFamily: fontFamily
            }} className="rounded-xl h-[95%] w-1/3 flex flex-col items-start justify-center px-6 overflow-hidden py-10">
                <p
                    className={`text-white w-full text-center break-words font-semibold text-xl overflow-hidden" }`}
                >
                    {content}
                </p>
              
            </div>
        </div>
    </div>

};

export default StoryTextPreview;
