import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "antd";
import { CaseSensitive } from "lucide-react";
import { FC, useState } from "react";
import dataBackgroundStory from '../../../data/data-background-story.json'
import cn from "../../../utils/cn";

const fontStyles = [
    { key: '1', label: 'Dancing Script', fontFamily: "'Dancing Script', cursive" },
    { key: '2', label: 'Noto Sans', fontFamily: "'Noto Sans', sans-serif" },
    { key: '3', label: 'Nunito', fontFamily: "'Nunito', sans-serif" },
    { key: '4', label: 'Pacifico', fontFamily: "'Pacifico', cursive" },
];


type StoryTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    onSelectBackground: (backgound: string) => void;
    onFontFamilySelect: (fontFamily: string) => void;
   
}

const StoryTextEditor: FC<StoryTextEditorProps> = ({
    value,
    onChange,
    onSelectBackground,
    onFontFamilySelect,
}) => {
    const [selectFont, setSelectFont] = useState<number>(0);
    const [selectBackground, setSelectBackground] = useState<number>(0);

    const handleSelectFont = (index: number) => {
        setSelectFont(index);
        onFontFamilySelect(fontStyles[index].fontFamily)
    };

    const handleSelectBackground = (index: number) => {
        setSelectBackground(index);
        onSelectBackground(dataBackgroundStory[index].background)
    }

    return <div className="flex flex-col gap-y-3 w-full">
     

        <textarea value={value} onChange={e => {
            if (e.target.value.trim().length > 400) return;
            onChange(e.target.value)
        }} className="outline-none border-[1px] border-gray-300 p-2 rounded-md whitespace-pre-wrap" placeholder="Bắt đầu nhập" rows={3}></textarea>

        <Dropdown menu={{
            items: fontStyles.map((font, index) => ({
                key: font.key,
                label: (
                    <div
                        onClick={() => handleSelectFont(index)}
                        style={{ fontFamily: font.fontFamily }}
                        className="px-2 py-1 cursor-pointer"
                    >
                        {font.label}
                    </div>
                ),
            })),
        }}
            placement="bottomRight" arrow>
            <button className="flex items-center justify-between p-3 rounded-md border-[1px] border-gray-300">
                <div className="flex items-center gap-x-2">
                    <CaseSensitive className="text-gray-600" />
                    <span style={{
                        fontFamily: fontStyles[selectFont].fontFamily
                    }} className="text-gray-600">{fontStyles[selectFont].label}</span>
                </div>

                <FontAwesomeIcon className="text-gray-600" icon={faCaretDown} />
            </button>
        </Dropdown>
        <div className="p-2 flex flex-col gap-y-2 border-[1px] border-gray-300 rounded-md">
            <span className="text-gray-400">Phông nền</span>
            <div className="flex items-center gap-2 flex-wrap">
                {dataBackgroundStory.map((item, index) => <div onClick={() => handleSelectBackground(index)} style={{
                    background: item.background
                }} key={item.name} className={cn('w-6 h-6 rounded-full cursor-pointer', index === selectBackground && 'w-7 h-7 border-[4px] border-primary')}></div>)}
            </div>
        </div>
    </div>
};

export default StoryTextEditor;
