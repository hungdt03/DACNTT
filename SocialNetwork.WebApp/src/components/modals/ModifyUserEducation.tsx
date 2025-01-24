import { Checkbox, DatePicker, Divider, Form, FormProps, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { FC, useState } from "react";
import schoolService from "../../services/schoolService";
import { SchoolResource } from "../../types/school";
import InputSearchDropdown from "../InputSearchDropdown";
import { Dayjs } from "dayjs";
import userService from "../../services/userService";
import { UserSchoolResource } from "../../types/userSchool";
import { Edit3, School } from "lucide-react";
import { EducationStatus } from "../../enums/education-status";

export type ModifyEducation = {
    school: string;
    startYear?: Dayjs;
    isGraduated: boolean;
    schoolId?: string;

    expand: boolean;
    showYear: boolean;
    searchValue: string;
}

export type EducationFormRequest = {
    educations: ModifyEducation[]
}

export type EducationExpandForm = {
    item: UserSchoolResource;
    expand: boolean;
    showYear: boolean;
    searchValue: string;
}

type ModifyUserEducationProps = {
    userSchools: UserSchoolResource[]
}

const ModifyUserEducation: FC<ModifyUserEducationProps> = ({
    userSchools
}) => {
    const [form] = useForm<EducationFormRequest>();
    const [schools, setSchools] = useState<SchoolResource[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    const [forms, setForms] = useState<EducationExpandForm[]>([...userSchools.map(item => ({
        item,
        expand: false,
        showYear: item.status !== EducationStatus.GRADUATED,
        searchValue: item.school.name
    } as EducationExpandForm))])

    const onFinish: FormProps<EducationFormRequest>['onFinish'] = async (values) => {
        console.log('Success:', values);
        const response = await userService.modifyUserEducation(values);
        if (response.isSuccess) {
            form.resetFields()
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

    const handleExpandForm = (index: number) => {
        setForms(prev => {
            const updateForm = [...prev];
            updateForm[index].expand = true
            return updateForm
        })
    }

    return <div className="flex flex-col gap-y-2 py-4 max-h-[550px] overflow-y-auto custom-scrollbar">
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="flex flex-col"
            initialValues={{
                educations: [...userSchools.map(item => ({
                    school: item.school.name,
                    isGraduated: item.status === EducationStatus.GRADUATED,
                    schoolId: item.school.id,
                    startDate: item.startDate
                }))]
            }}
        >
            {forms.map((formItem, index) => {
                if (formItem.expand) {
                    return <React.Fragment key={formItem.item.id}>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item<EducationFormRequest>
                                label="Trường học"
                                name={["educations", index, "school"]}
                                rules={[{ required: true, message: 'Vui lòng nhập trường học!' }]}
                            >
                                <InputSearchDropdown
                                    onSearch={fetchSchools}
                                    options={schools}
                                    value={formItem.searchValue}
                                    onChange={(value) => {
                                        setForms(prev => {
                                            const udpateList = [...prev]
                                            udpateList[index].searchValue = value
                                            return udpateList
                                        })
                                        form.setFieldValue(["educations", index, "schoolId"], '')
                                    }}
                                    onSelect={(value) => form.setFieldValue(["educations", index, "schoolId"], value)}
                                />

                            </Form.Item>

                            {
                                formItem.showYear && <Form.Item<EducationFormRequest>
                                    label="Năm bắt đầu"
                                    name={["educations", index, "startYear"]}
                                    rules={[{ required: true, message: 'Vui lòng nhập bắt đầu nhập học!' }]}
                                >
                                    <DatePicker picker="year" size="large" classNames={{
                                        popup: 'text-sm'
                                    }} className="w-full" placeholder="Chọn năm bắt đầu" />
                                </Form.Item>
                            }
                        </div>
                        <Form.Item<EducationFormRequest> name={["educations", index, "schoolId"]} hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item<EducationFormRequest> name={["educations", index, "isGraduated"]} valuePropName="checked" label={null}>
                            <Checkbox onChange={(e) => {
                                setForms(prev => {
                                    const udpateList = [...prev]
                                    udpateList[index].showYear = !e.target.checked
                                    return udpateList
                                })
                                form.setFieldValue(["educations", index, "isGraduated"], e.target.checked)
                            }} checked>Đã tốt nghiệp</Checkbox>
                        </Form.Item>


                        <Divider className="mt-0 mb-2" />
                    </React.Fragment>
                }

                return <React.Fragment key={formItem.item.id}>
                    <div className="flex items-center gap-x-3">
                        <School size={20} />
                        <div className="flex items-center">
                            <div className="flex items-center gap-x-1">
                                {formItem.item.status === EducationStatus.GRADUATED ? 'Đã học' : 'Đang học'} tại <span className="font-bold">{formItem.item.school.name}</span>
                                <Edit3 onClick={() => handleExpandForm(index)} size={12} className="ml-1 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <Divider className="my-2" />
                </React.Fragment>
            })}
            {/* <Form.Item<ModifyEducationForm>
                label="Trường học"
                name="school"
                rules={[{ required: true, message: 'Vui lòng nhập trường học!' }]}
            >
                <InputSearchDropdown
                    onSearch={fetchSchools}
                    options={schools}
                    value={searchValue}
                    onChange={(value) => {
                        setSearchValue(value)
                        form.setFieldValue('schoolId', '')
                    }}
                    onSelect={(value) => form.setFieldValue('schoolId', value)}
                />

            </Form.Item>
            <Form.Item<ModifyEducationForm> name="schoolId" hidden>
                <Input />
            </Form.Item>
            <Form.Item<ModifyEducationForm> name="isGraduated" valuePropName="checked" label={null}>
                <Checkbox onChange={(e) => {
                    setIsShowYear(!e.target.checked)
                    form.setFieldValue('isGraduated', e.target.checked)
                }} checked>Đã tốt nghiệp</Checkbox>
            </Form.Item>

            {isShowYear && <Form.Item<ModifyEducationForm>
                label="Năm bắt đầu"
                name="startYear"
                rules={[{ required: true, message: 'Vui lòng nhập bắt đầu nhập học!' }]}
            >
                <DatePicker picker="year" className="w-full" placeholder="Chọn năm bắt đầu" />
            </Form.Item>
            }


            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item> */}
        </Form>
    </div>
};

export default ModifyUserEducation;
