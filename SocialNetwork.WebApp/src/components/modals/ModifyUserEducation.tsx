import { Button, Checkbox, DatePicker, Form, FormProps, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { FC, useEffect, useState } from "react";
import schoolService from "../../services/schoolService";
import { SchoolResource } from "../../types/school";
import InputSearchDropdown from "../InputSearchDropdown";
import dayjs, { Dayjs } from "dayjs";
import userService from "../../services/userService";
import { UserSchoolResource } from "../../types/userSchool";
import { EducationStatus } from "../../enums/education-status";
import { MajorResource } from "../../types/major";
import majorService from "../../services/majorService";

export type ModifyEducationRequest = {
    school: string;
    major: string;
    startYear?: number;
    isGraduated: boolean;
    schoolId: string | null;
    majorId: string | null;
}

export type ModifyEducationForm = {
    school: string;
    major: string;
    startYear?: Dayjs;
    isGraduated: boolean;
    schoolId: string | null;
    majorId: string | null;
}

type ModifyUserEducationProps = {
    userSchool: UserSchoolResource | undefined;
    onFetch?: () => void
}

const ModifyUserEducation: FC<ModifyUserEducationProps> = ({
    userSchool,
    onFetch
}) => {
    const [form] = useForm<ModifyEducationForm>();
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchMajor, setSearchMajor] = useState<string>('');

    const [schools, setSchools] = useState<SchoolResource[]>([])
    const [majors, setMajors] = useState<MajorResource[]>([])

    const [showYear, setShowYear] = useState(userSchool ? userSchool.status !== EducationStatus.GRADUATED : false);
    const [disabled, setDisabled] = useState(true)

    const onFinish: FormProps<ModifyEducationForm>['onFinish'] = async (values) => {
        const payload: ModifyEducationRequest = {
            isGraduated: values.isGraduated,
            school: values.school,
            major: values.major,
            schoolId: values.schoolId ? values.schoolId : null,
            majorId: values.majorId ? values.majorId : null,
            startYear: values.startYear?.year() ?? 2025
        }

        let response;
        if (userSchool) {
            response = await userService.updateUserEducation(userSchool.id, payload);
        } else {
            response = await userService.addUserEducation(payload);
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

    const fetchSchools = async (name: string) => {
        const response = await schoolService.searchSchool(name);
        if (response.isSuccess) {
            setSchools(response.data)
        }
    }

    const fetchMajors = async (name: string) => {
        const response = await majorService.searchMajors(name);
        if (response.isSuccess) {
            setMajors(response.data)
        }
    }

    useEffect(() => {
        form.resetFields();

        if (form && userSchool) {
            setSearchValue(userSchool.school.name)
            form.setFieldsValue({
                "isGraduated": userSchool.status === EducationStatus.GRADUATED,
                "schoolId": userSchool.school.id,
                "majorId": userSchool.major.id,
                "school": userSchool.school.name,
                "major": userSchool.major.name,
                "startYear": dayjs().set('year', userSchool.startYear),
            })

            setDisabled(true)
            setShowYear(userSchool ? userSchool.status !== EducationStatus.GRADUATED : false)
        }
    }, [userSchool, form])

    return <div className="max-h-[550px] overflow-y-auto custom-scrollbar">
        <Form
            form={form}
            key={userSchool?.school.id}
            onFinish={onFinish}
            initialValues={{
                school: userSchool?.school.name,
                schoolId: userSchool?.school.id,
                isGraduated: userSchool?.status === EducationStatus.GRADUATED || true,
                startYear: dayjs().set('year', userSchool?.startYear ?? 2025)
            }}
            onValuesChange={() => setDisabled(false)}
            layout="vertical"
        >
            <Form.Item<ModifyEducationForm>
                label="Ngành học"
                name="major"
                rules={[{ required: true, message: 'Vui lòng nhập ngành học!' }]}
            >
                <InputSearchDropdown
                    id={`major-${userSchool?.major.id}`}
                    onSearch={fetchMajors}
                    options={majors.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    value={searchMajor}
                    placeholder='Nhập tên ngành học'
                    onChange={(value) => {
                        setSearchMajor(value)
                        form.setFieldValue("majorId", '')
                        form.setFieldValue("major", value)
                    }}
                    onSelect={(value) => form.setFieldValue("majorId", value)}
                />

            </Form.Item>
            <Form.Item<ModifyEducationForm>
                label="Trường học"
                name="school"
                rules={[{ required: true, message: 'Vui lòng nhập trường học!' }]}
            >
                <InputSearchDropdown
                    id={`school-${userSchool?.school.id}`}
                    onSearch={fetchSchools}
                    options={schools.map(item => ({
                        label: item.name,
                        value: item.id
                    }))}
                    placeholder='Nhập tên trường học'
                    value={searchValue}
                    onChange={(value) => {
                        setSearchValue(value)
                        form.setFieldValue("schoolId", '')
                        form.setFieldValue("school", value)
                    }}
                    onSelect={(value) => form.setFieldValue("schoolId", value)}
                />

            </Form.Item>
            {
                showYear && <Form.Item<ModifyEducationForm>
                    label="Năm bắt đầu"
                    name="startYear"
                    rules={[{ required: true, message: 'Vui lòng nhập năm bắt đầu nhập học!' }]}
                >
                    <DatePicker picker="year" className="w-full" placeholder="Chọn năm bắt đầu" />
                </Form.Item>
            }
            <Form.Item<ModifyEducationForm> name="schoolId" hidden>
                <Input />
            </Form.Item>
            <Form.Item<ModifyEducationForm> name="isGraduated" valuePropName="checked" >
                <Checkbox onChange={(e) => {
                    setShowYear(!e.target.checked)
                    form.setFieldValue("isGraduated", e.target.checked)
                }} >Đã tốt nghiệp</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button disabled={disabled} type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default ModifyUserEducation;
