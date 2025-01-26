import { Button, Form, FormProps, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, useEffect, useState } from "react";
import InputSearchDropdown from "../InputSearchDropdown";
import userService from "../../services/userService";
import { LocationResource } from "../../types/location";
import locationService from "../../services/locationService";

export type ModifyUserHometownRequest = {
    address: string;
    locationId: string | null;
}


type ModifyUserHometownProps = {
    userLocation: LocationResource | undefined;
    onFetch?: () => void
}

const ModifyUserHometown: FC<ModifyUserHometownProps> = ({
    userLocation,
    onFetch
}) => {
    const [form] = useForm<ModifyUserHometownRequest>();
    const [searchValue, setSearchValue] = useState<string>('');

    const [locations, setLocations] = useState<LocationResource[]>([])
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<ModifyUserHometownRequest>['onFinish'] = async (values) => {
        const response = await userService.modifyUserHometown(values);
        if (response.isSuccess) {
            onFetch?.()
            form.resetFields()
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    const fetchLocations = async (name: string) => {
        const response = await locationService.searchLocations(name);
        if (response.isSuccess) {
            setLocations(response.data)
        }
    }

    useEffect(() => {
        form.resetFields();

        if (form && userLocation) {
            setSearchValue(userLocation.address)
            form.setFieldsValue({
                "locationId": userLocation.id,
                "address": userLocation.address,
            })
        }
    }, [userLocation, form])

    return <div className="max-h-[550px] overflow-y-auto custom-scrollbar">
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
                address: userLocation?.address,
                locationId: userLocation?.id,
            }}
            onValuesChange={() => setDisabled(false)}
            layout="vertical"
        >
            <Form.Item<ModifyUserHometownRequest>
                label="Địa điểm"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
            >
                <InputSearchDropdown
                    id={`hometown-${userLocation?.id}`}
                    onSearch={fetchLocations}
                    options={locations.map(item => ({
                        label: item.address,
                        value: item.id
                    }))}
                    placeholder='Nhập tên địa điểm'
                    value={searchValue}
                    onChange={(value) => {
                        setSearchValue(value)
                        form.setFieldValue("locationId", '')
                        form.setFieldValue("address", value)
                    }}
                    onSelect={(value) => form.setFieldValue("locationId", value)}
                />
            </Form.Item>
            <Form.Item>
                <Button disabled={disabled} type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default ModifyUserHometown;
