import { FC, useState } from "react";
import { Formik, Form, Field } from 'formik';
import { Link } from "react-router-dom";
import images from "../../assets";
import signInSchema from "../../schemas/signInSchema";
import cn from "../../utils/cn";
import authService from "../../services/authService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { signIn } from "../../features/slices/auth-slice";
import { Button } from "antd";

export type SignInRequest = {
    email: string;
    password: string;
}

const SignInPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false)

    const handleLoginAsync = async (values: SignInRequest) => {
        setLoading(true)
        const response = await authService.signIn(values);
        setLoading(false)
        if (response.isSuccess) {
            dispatch(signIn(response.data))
            toast.success(response.message)
        } else {
            toast.error(response.message)
        }
    }

    return <div className="flex flex-col gap-y-6 items-center justify-center h-full p-8">
        <img alt="facebook" className="w-20 h-20" src={images.facebook} />
        <span className="font-bold text-2xl text-primary">ĐĂNG NHẬP</span>

        <Formik<SignInRequest>
            initialValues={{
                email: '',
                password: '',
            }}
            onSubmit={handleLoginAsync}
            validationSchema={signInSchema}
        >
            {({ errors, touched }) => (
                <Form className="flex flex-col gap-y-4 w-full">
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Email
                        </label>
                        <Field name="email" id='email' placeholder="Địa chỉ email" className={cn('border-[1px] outline-none px-6 py-2 rounded-3xl transition-all ease-linear duration-150', (errors.email && touched.email) ? 'border-red-500' : 'border-primary')} />
                        {errors.email && touched.email && <div className="text-sm pl-3 text-red-500">{errors.email}</div>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="password" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Mật khẩu
                        </label>
                        <Field name="password" type='password' id='password' placeholder='Mật khẩu' className={cn('border-[1px] outline-none px-6 py-2 rounded-3xl transition-all ease-linear duration-150', (errors.email && touched.email) ? 'border-red-500' : 'border-primary')} />
                        {errors.password && touched.password && <div className="text-sm pl-3 text-red-500">{errors.password}</div>}

                    </div>
                    <div className="w-full flex justify-end">
                        <Link to='/forgot-password' className="text-primary font-semibold text-sm">Quên mật khẩu?</Link>
                    </div>
                    <Button htmlType="submit" loading={loading} className="w-full mt-2 px-3 rounded-3xl text-white bg-primary">Đăng nhập</Button>
                    <div className="flex items-center gap-x-2 justify-center">
                        <span>Chưa có tài khoản?</span>
                        <Link className="text-primary" to='/sign-up'>Đăng kí</Link>
                    </div>
                </Form>
            )}
        </Formik>
    </div>
};

export default SignInPage;
