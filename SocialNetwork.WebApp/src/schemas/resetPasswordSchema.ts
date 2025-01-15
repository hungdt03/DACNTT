import * as Yup from 'yup';
import { ResetPasswordFormik } from '../components/ResetPassword';

const resetPasswordSchema = Yup.object<ResetPasswordFormik>({
    newPassword: Yup.string()
        .required('Mật khẩu không được để trống'),
    confirmPassword: Yup.string()
        .required('Mật khẩu không được để trống')
        .test('passwords-match', 'Mật khẩu xác nhận không khớp', function (value) {
            return value === this.parent.newPassword;
        }),
});

export default resetPasswordSchema;