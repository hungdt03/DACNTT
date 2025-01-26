import { Button, Checkbox, DatePicker, Form, FormProps, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, useEffect, useState } from "react";
import InputSearchDropdown from "../InputSearchDropdown";
import dayjs, { Dayjs } from "dayjs";
import userService from "../../services/userService";
import { UserWorkPlaceResource } from "../../types/userWorkPlace";
import companyService from "../../services/companyService";
import { CompanyResource } from "../../types/company";
import { PositionResource } from "../../types/position";
import positionService from "../../services/positionService";

export type ModifyUserWorkPlaceRequest = {
    company: string;
    position: string;
    startYear?: number;
    isCurrent: boolean;
    companyId: string | null;
    positionId: string | null;
}

export type ModifyUserWorkPlaceForm = {
    company: string;
    position: string;
    startYear?: Dayjs;
    isCurrent: boolean;
    companyId: string | null;
    positionId: string | null;
}

type ModifyUserWorkPlaceProps = {
    userWorkPlace: UserWorkPlaceResource | undefined;
    onFetch?: () => void
}

const ModifyUserWorkPlace: FC<ModifyUserWorkPlaceProps> = ({
    userWorkPlace,
    onFetch
}) => {
    const [form] = useForm<ModifyUserWorkPlaceForm>();
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchPosition, setSearchPosition] = useState<string>('');

    const [companies, setCompanies] = useState<CompanyResource[]>([])
    const [positions, setPositions] = useState<PositionResource[]>([])

    const [showYear, setShowYear] = useState(userWorkPlace ? userWorkPlace?.isCurrent : true);
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<ModifyUserWorkPlaceForm>['onFinish'] = async (values) => {
        const payload: ModifyUserWorkPlaceRequest = {
            isCurrent: values.isCurrent,
            company: values.company,
            position: values.position,
            companyId: values.companyId ? values.companyId : null,
            positionId: values.positionId ? values.positionId : null,
            startYear: values.startYear?.year() ?? 2025
        }

        let response;
        if (userWorkPlace) {
            response = await userService.updateUserWorkPlace(userWorkPlace.id, payload);
        } else {
            response = await userService.addUserWorkPlace(payload);
        }

        if (response.isSuccess) {
            onFetch?.()
            form.resetFields()
            setShowYear(false)
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    };

    const fetchCompanies = async (name: string) => {
        const response = await companyService.searchCompanies(name);
        if (response.isSuccess) {
            setCompanies(response.data)
        }
    }

    const fetchPositions = async (name: string) => {
        const response = await positionService.searchPositions(name);
        if (response.isSuccess) {
            setPositions(response.data)
        }
    }

    useEffect(() => {
        form.resetFields();

        if (form && userWorkPlace) {
            setSearchValue(userWorkPlace.company.name)
            form.setFieldsValue({
                "isCurrent": userWorkPlace.isCurrent,
                "companyId": userWorkPlace.company.id,
                "positionId": userWorkPlace.position.id,
                "company": userWorkPlace.company.name,
                "position": userWorkPlace.position.name,
                "startYear": dayjs().set('year', userWorkPlace.startYear),
            })

            setDisabled(true)
            setShowYear(userWorkPlace ? userWorkPlace?.isCurrent : true)
        }
    }, [userWorkPlace, form])

    return <div className="max-h-[550px] overflow-y-auto custom-scrollbar">
        <Form
            form={form}
            key={userWorkPlace?.company.id}
            onFinish={onFinish}
            initialValues={{
                company: userWorkPlace?.company.name,
                companyId: userWorkPlace?.company.id,
                isCurrent: userWorkPlace?.isCurrent || true,
                startYear: dayjs().set('year', userWorkPlace?.startYear ?? 2025)
            }}
            onValuesChange={() => setDisabled(false)}
            layout="vertical"
        >
            <Form.Item<ModifyUserWorkPlaceForm>
                label="Vị trí"
                name="position"
                rules={[{ required: true, message: 'Vui lòng vị trí làm việc!' }]}
            >
                <InputSearchDropdown
                    id={`position-${userWorkPlace?.position.id}`}
                    onSearch={fetchPositions}
                    options={positions.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    value={searchPosition}
                    placeholder='Nhập vị trí làm việc'
                    onChange={(value) => {
                        setSearchPosition(value)
                        form.setFieldValue("positionId", '')
                        form.setFieldValue("position", value)
                    }}
                    onSelect={(value) => form.setFieldValue("positionId", value)}
                />

            </Form.Item>
            <Form.Item<ModifyUserWorkPlaceForm>
                label="Tên công ty / Doanh nghiệp / Tổ chức"
                name="company"
                rules={[{ required: true, message: 'Vui lòng nhập nơi làm việc' }]}
            >
                <InputSearchDropdown
                    id={`company-${userWorkPlace?.company.id}`}
                    onSearch={fetchCompanies}
                    options={companies.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    placeholder='Nhập nơi làm việc'
                    value={searchValue}
                    onChange={(value) => {
                        setSearchValue(value)
                        form.setFieldValue("companyId", '')
                        form.setFieldValue("company", value)
                    }}
                    onSelect={(value) => form.setFieldValue("companyId", value)}
                />

            </Form.Item>
            {
                showYear && <Form.Item<ModifyUserWorkPlaceForm>
                    label="Năm bắt đầu"
                    name="startYear"
                    rules={[{ required: true, message: 'Vui lòng nhập năm bắt đầu làm!' }]}
                >
                    <DatePicker picker="year" className="w-full" placeholder="Chọn năm bắt đầu" />
                </Form.Item>
            }
            <Form.Item<ModifyUserWorkPlaceForm> name="companyId" hidden>
                <Input />
            </Form.Item>
            <Form.Item<ModifyUserWorkPlaceForm> name="isCurrent" valuePropName="checked" >
                <Checkbox onChange={(e) => {
                    setShowYear(e.target.checked)
                    form.setFieldValue("isCurrent", e.target.checked)
                }} >Đang công tác</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button disabled={disabled} type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default ModifyUserWorkPlace;
