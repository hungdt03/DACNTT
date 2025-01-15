import * as Yup from 'yup';
import { ForgotPasswordFormik } from '../pages/ForgotPasswordPage';

const forgotPasswordSchema = Yup.object<ForgotPasswordFormik>({
    email: Yup.string()
        .required('Địa chỉ email không được để trống')
        .email('Định dạng email không hợp lệ'),
});

export default forgotPasswordSchema;