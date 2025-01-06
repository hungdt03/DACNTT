import { FC } from "react";
import cn from "../../utils/cn";
import dataBackgroundStory from '../../data/data-background-story.json';

type BackgroundPostOptionProps = {
    onChange?: (background: string | undefined) => void
}

const BackgroundPostOption: FC<BackgroundPostOptionProps> = ({
    onChange
}) => {
    return <div className="w-[350px] flex flex-col gap-y-3">
        <span className="text-[17px] font-semibold text-center">Chọn phông nền</span>
        <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => onChange?.(undefined)} style={{
                background: 'white'
            }} className={cn('w-6 h-6 rounded-md cursor-pointer border-[1px] border-gray-200')}></button>
            {dataBackgroundStory.map((item, index) => <button onClick={() => onChange?.(item.background)} style={{
                background: item.background
            }} key={item.name} className={cn('w-6 h-6 rounded-md cursor-pointer')}></button>)}
        </div>
    </div>
};

export default BackgroundPostOption;
