import { Button, DatePicker, Form, FormProps, Input, message, Radio } from "antd";
import { FC } from "react";
import { UserResource } from "../../types/user";
import { Gender } from "../../enums/gender";
import dayjs from "dayjs";
import userService from "../../services/userService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setUserDetails } from "../../features/slices/auth-slice";


export type UpdateUserInfo = {
    fullName: string;
    gender?: string;
    birthday?: string;
    phoneNumber?: string;
};

type UpdateUserInfoModalProps = {
    user: UserResource;
    onSuccess: () => void
}

const UpdateUserInfoModal: FC<UpdateUserInfoModalProps> = ({
    user,
    onSuccess
}) => {

    const dispatch = useDispatch<AppDispatch>();

    const onFinish: FormProps<UpdateUserInfo>['onFinish'] = async (values) => {
        const response = await userService.updateUserBasicInfo(values);
        if (response.isSuccess) {
            message.success(response.message)
            dispatch(setUserDetails(response.data))
            onSuccess()
        } else {
            message.error(response.message)
        }
    };

    return <div>
        <Form<UpdateUserInfo>
            name="update-user-info"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
                fullName: user.fullName,
                gender: user.gender,
                birthday: user.dateOfBirth ? dayjs(new Date(user.dateOfBirth)) : dayjs(),
                phoneNumber: user.phoneNumber
            }}
        >
            <Form.Item<UpdateUserInfo>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
                <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item<UpdateUserInfo>
                label="Giới tính"
                name="gender"
            >
                <Radio.Group >
                    <Radio value={Gender.MALE}>Nam</Radio>
                    <Radio value={Gender.FEMALE}>Nữ</Radio>
                    <Radio value={Gender.OTHER}>Khác</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item<UpdateUserInfo>
                label="Ngày sinh"
                name="birthday"
            >
                <DatePicker placeholder="Chọn ngày sinh" />
            </Form.Item>

            <Form.Item<UpdateUserInfo>
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                    {
                        pattern: /^[0-9]{10,11}$/, // Kiểm tra số điện thoại (10-11 số)
                        message: 'Số điện thoại không hợp lệ'
                    }
                ]}
            >
                <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Lưu lại
                </Button>
            </Form.Item>
        </Form>
    </div>
};

export default UpdateUserInfoModal;
