import { FC } from "react";
import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from "react-router-dom";
import images from "../assets";
import authService from "../services/authService";
import { toast } from "react-toastify";
import signUpSchema from "../schemas/signUpSchema";

export type SignUpRequest = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}


const SignUpPage: FC = () => {
    const navigate = useNavigate();


    const handleSignUpAsync = async (values: SignUpRequest) => {
        const response = await authService.signUp(values);
        if(response.isSuccess) {
            toast.success(response.message)
            navigate('/sign-in');
        } else {
            toast.error(response.message)
        }
    }

    return <div className="flex flex-col gap-y-6 items-center justify-center h-full p-8">

        <img alt="facebook" className="w-20 h-20" src={images.facebook} />
        <span className="font-bold text-2xl text-primary">ĐĂNG KÍ TÀI KHOẢN</span>

        <Formik<SignUpRequest>
            initialValues={{
                email: '',
                fullName: '',
                password: '',
                confirmPassword: '',
            }}
            onSubmit={handleSignUpAsync}
            validationSchema={signUpSchema}
        >
            {({ errors, touched }) => (
                <Form className="flex flex-col gap-y-4 w-full">
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="fullName" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Họ và tên
                        </label>
                        <Field name="fullName" id='fullName' placeholder="Họ và tên" className='border-[1px] outline-none px-6 py-2 rounded-3xl border-primary' />
                        {errors.fullName && touched.fullName && <div className="text-sm pl-3 text-red-500">{errors.fullName}</div>}
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="email" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Email
                        </label>
                        <Field name="email" id='email' placeholder="Địa chỉ email" className='border-[1px] outline-none px-6 py-2 rounded-3xl border-primary' />
                        {errors.email && touched.email && <div className="text-sm pl-3 text-red-500">{errors.email}</div>}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="password" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Mật khẩu
                        </label>
                        <Field name="password" id='password' placeholder='Mật khẩu' className='border-[1px] outline-none px-6 py-2 rounded-3xl border-primary' />
                        {errors.password && touched.password && <div className="text-sm pl-3 text-red-500">{errors.password}</div>}

                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="confirmPassword" className="mb-1 pl-3 text-[16px] font-medium text-sky-700">
                            Nhập lại mật khẩu
                        </label>
                        <Field name="confirmPassword" id='confirmPassword' placeholder='Xác nhận mật khẩu' className='border-[1px] outline-none px-6 py-2 rounded-3xl border-primary' />
                        {errors.confirmPassword && touched.confirmPassword && <div className="text-sm pl-3 text-red-500">{errors.confirmPassword}</div>}

                    </div>
                    <button className="w-full py-2 mt-4 px-3 rounded-3xl text-white bg-primary" type="submit">Đăng kí</button>
                    <div className="flex items-center gap-x-2 justify-center">
                        <span>Đã có tài khoản?</span>
                        <Link className="text-primary" to='/sign-in'>Đăng nhập</Link>
                    </div>
                </Form>
            )}
        </Formik>
    </div>
};

export default SignUpPage;
