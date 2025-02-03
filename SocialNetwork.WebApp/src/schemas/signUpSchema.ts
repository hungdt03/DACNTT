import * as Yup from 'yup';
import { SignUpRequest } from '../pages/auth/SignUpPage';

const signUpSchema = Yup.object<SignUpRequest>({
    fullName: Yup.string()
        .required('Họ và tên không được để trống'),

    email: Yup.string()
        .required('Địa chỉ email không được để trống')
        .email('Định dạng email không hợp lệ'),

    password: Yup.string()
        .required('Mật khẩu không được để trống'),

    confirmPassword: Yup.string()
        .required('Mật khẩu không được để trống')
        .test('passwords-match', 'Mật khẩu xác nhận không khớp', function (value) {
            return value === this.parent.password;
        }),
});

export default signUpSchema;