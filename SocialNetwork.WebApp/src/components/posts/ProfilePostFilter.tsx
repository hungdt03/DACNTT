import { DatePicker, Dropdown } from "antd";
import { Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { CONTENT_TYPES, ContentTypeKey, SORT_ORDER, SortOrderKey } from "../../utils/filter";
import useDebounce from "../../hooks/useDebounce";
import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export type ProfilePostFilter = {
    search?: string;
    fromDate?: string;
    toDate?: string;
    sortOrder: SortOrderKey;
    contentType?: ContentTypeKey;
};

type ProfilePostFilterProps = {
    onChange: (filter: ProfilePostFilter) => void;
};

const ProfilePostFilter: FC<ProfilePostFilterProps> = ({ onChange }) => {
    const [searchValue, setSearchValue] = useState("");
    const [filter, setFilter] = useState<ProfilePostFilter>({
        sortOrder: "desc",
        contentType: 'ALL',
        search: ''
    });

    const debouncedSearch = useDebounce(searchValue, 300);

    // Khi debouncedSearch thay đổi, cập nhật filter
    useEffect(() => {
        const updatedFilter = { ...filter, search: debouncedSearch };
        setFilter(updatedFilter);
        onChange(updatedFilter);
    }, [debouncedSearch]);

    const handleContentTypeChange = (key: ContentTypeKey) => {
        const updatedFilter = { ...filter, contentType: key };
        setFilter(updatedFilter);
        onChange(updatedFilter);
    };

    const handleSortOrderChange = (key: SortOrderKey) => {
        const updatedFilter = { ...filter, sortOrder: key };
        setFilter(updatedFilter);
        onChange(updatedFilter);
    };
    const handleChangeDate = (dates: (Dayjs | null)[] | null, dateStrings: [string, string]) => {
        const updateFilter = {
            ...filter,
            fromDate: dateStrings[0] || undefined, // Nếu rỗng thì bỏ qua
            toDate: dateStrings[1] || undefined,
        };
        setFilter(updateFilter);
        onChange(updateFilter);
    };


    return (
        <div className="flex items-center flex-wrap gap-y-2 gap-x-4 bg-white z-10">
            {/* Input Tìm kiếm */}
            <div className="px-4 flex items-center gap-x-2 rounded-3xl bg-gray-100">
                <Search size={14} />
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Tìm kiếm"
                    className="px-2 py-1 w-full bg-gray-100 outline-none border-none"
                />
            </div>

          
            {/* Dropdown Chọn Loại Nội Dung */}
            <Dropdown
                menu={{
                    items: CONTENT_TYPES.map((item) => ({
                        key: item.key,
                        label: item.label,
                        onClick: () => handleContentTypeChange(item.key),
                    })),
                }}
                placement="bottom"
            >
                <button className="py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                    {filter.contentType
                        ? CONTENT_TYPES.find((item) => item.key === filter.contentType)?.label
                        : "Loại nội dung"}
                </button>
            </Dropdown>

            {/* Dropdown Chọn Thứ Tự Sắp Xếp */}
            <Dropdown
                menu={{
                    items: SORT_ORDER.map((item) => ({
                        key: item.key,
                        label: item.label,
                        onClick: () => handleSortOrderChange(item.key),
                    })),
                }}
                placement="bottom"
            >
                <button className="py-[6px] px-4 text-sm rounded-md font-semibold bg-gray-100 hover:bg-gray-200">
                    {SORT_ORDER.find((item) => item.key === filter.sortOrder)?.label || "Cũ nhất trước"}
                </button>
            </Dropdown>

              {/* Chọn Ngày */}
              <RangePicker
                onChange={handleChangeDate}
                placeholder={["Từ ngày", "Đến ngày"]}
            />

          
        </div>
    );
};

export default ProfilePostFilter;
