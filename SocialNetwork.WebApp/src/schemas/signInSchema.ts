import * as Yup from 'yup';
import { SignInRequest } from '../pages/auth/SignInPage';

const signInSchema = Yup.object<SignInRequest>({
    email: Yup.string()
        .required('Địa chỉ email không được để trống')
        .email('Định dạng email không hợp lệ'),

    password: Yup.string()
        .required('Mật khẩu không được để trống'),

});

export default signInSchema;