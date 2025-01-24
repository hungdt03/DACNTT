import { Input } from "antd";
import { FC, useEffect, useState } from "react";
import { SchoolResource } from "../types/school";
import useDebounce from "../hooks/useDebounce";

type InputSearchDropdownProps = {
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onSelect?: (value: string) => void;
    options: SchoolResource[];
    value?: string;
}

const InputSearchDropdown: FC<InputSearchDropdownProps> = ({
    onChange,
    onSearch,
    onSelect,
    options,
    value = ''
}) => {
    const [schoolName, setSchoolName] = useState(value)
    const debounceValue = useDebounce(value ?? '', 500);
    const [isSelect, setIsSelect] = useState(true)

    const handleSelectSchool = (school: SchoolResource) => {
        setSchoolName(school.name)
        onChange?.(school.name)
        onSelect?.(school.id);
        setIsSelect(true)
    }

    const handleInputChange = (newValue: string) => {
        setSchoolName(newValue)
        onChange?.(newValue)
        setIsSelect(false)
    }

    useEffect(() => {
        if (debounceValue.trim()) {
            onSearch?.(debounceValue)
        }
    }, [debounceValue])

    return <div className="flex flex-col gap-y-1">
        <Input value={schoolName} onChange={e => handleInputChange(e.target.value)} className="text-sm" size="large" placeholder="Nhập tên trường học" />

        {options.length > 0 && !isSelect && <div className="px-2 py-1 flex flex-col gap-y-1 shadow bg-white z-10 rounded-lg max-h-[150px] overflow-y-auto custom-scrollbar">
            {options.map(option => <span key={option.id} onClick={() => handleSelectSchool(option)} className="px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer">{option.name}</span>)}
        </div>}
    </div>
};

export default InputSearchDropdown;
