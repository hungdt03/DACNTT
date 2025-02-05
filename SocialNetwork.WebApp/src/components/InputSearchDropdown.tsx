import { Input } from "antd";
import { FC, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

type InputSearchDropdownType = {
    label: string;
    value: string
}

type InputSearchDropdownProps = {
    id?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onSelect?: (value: string) => void;
    options: InputSearchDropdownType[];
    value?: string;
    placeholder?: string;
}

const InputSearchDropdown: FC<InputSearchDropdownProps> = ({
    id,
    onChange,
    onSearch,
    onSelect,
    options,
    value = '',
    placeholder = ''
}) => {
    const [valueName, setValueName] = useState(value)
    const debounceValue = useDebounce(value ?? '', 200);
    const [isSelect, setIsSelect] = useState(true)

    const handleSelectOption = (option: InputSearchDropdownType) => {
        setValueName(option.label)
        onChange?.(option.label)
        onSelect?.(option.value);
        setIsSelect(true)
    }

    const handleInputChange = (newValue: string) => {
        setValueName(newValue)
        onChange?.(newValue)
        setIsSelect(false)
    }

    useEffect(() => {
        if (debounceValue.trim()) {
            onSearch?.(debounceValue)
        }
    }, [debounceValue])

    return <div className="flex flex-col gap-y-1">
        <Input 
            id={id}
            value={valueName} 
            onChange={e => handleInputChange(e.target.value)} 
            placeholder={placeholder}
        />

        {options.length > 0 && !isSelect && <div className="px-2 py-1 flex flex-col gap-y-1 shadow bg-white z-10 rounded-lg max-h-[150px] overflow-y-auto custom-scrollbar">
            {options.map(option => <span key={option.value} onClick={() => handleSelectOption(option)} className="px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer">{option.label}</span>)}
        </div>}
    </div>
};

export default InputSearchDropdown;
