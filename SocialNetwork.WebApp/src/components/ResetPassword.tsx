import { FC } from "react";
import images from "../assets";
import { Field, Form, Formik } from "formik";
import resetPasswordSchema from "../schemas/resetPasswordSchema";
import { Button } from "antd";

export type ResetPasswordFormik = {
    newPassword: string;
    confirmPassword: string;
}

type ResetPasswordProps = {
    onSubmit: (password: string) => void;
    loading: boolean
}

const ResetPassword: FC<ResetPasswordProps> = ({
    onSubmit,
    loading
}) => {
    return <div className="flex flex-col gap-y-6 items-center justify-center h-full p-8">
        <img alt="facebook" className="w-20 h-20" src={images.facebook} />
        <span className="font-bold text-2xl text-primary">KHÔI PHỤC MẬT KHẨU</span>

        <Formik<ResetPasswordFormik>
            initialValues={{
                newPassword: '',
                confirmPassword: '',
            }}
            onSubmit={(values) => onSubmit(values.newPassword)}
            validationSchema={resetPasswordSchema}
        >
            {({ errors, touched }) => (
                <Form className="flex flex-col gap-y-4 w-full">

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="newPassword" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Mật khẩu
                        </label>
                        <Field name="newPassword" id='newPassword' placeholder='Mật khẩu' className='border-[1px] outline-none px-6 py-2 rounded-3xl border-primary' />
                        {errors.newPassword && touched.newPassword && <div className="text-sm pl-3 text-red-500">{errors.newPassword}</div>}
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="confirmPassword" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Nhập lại mật khẩu
                        </label>
                        <Field name="confirmPassword" id='confirmPassword' placeholder='Xác nhận mật khẩu' className='border-[1px] outline-none px-6 py-2 rounded-3xl border-primary' />
                        {errors.confirmPassword && touched.confirmPassword && <div className="text-sm pl-3 text-red-500">{errors.confirmPassword}</div>}

                    </div>
                    <Button htmlType="submit" type="primary" loading={loading} shape="round">Gửi</Button>
                   
                </Form>
            )}
        </Formik>
    </div>
};

export default ResetPassword;
