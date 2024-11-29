import { FC } from "react";
import { Formik, Form, Field } from 'formik';
import { Link } from "react-router-dom";
import images from "../assets";

const SignInPage: FC = () => {
    return <div className="flex flex-col gap-y-6 items-center justify-center h-full p-8">
        <img className="w-20 h-20" src={images.facebook} />
        <span className="font-bold text-2xl text-primary">ĐĂNG NHẬP</span>

        <Formik
            initialValues={{
                email: '',
                password: '',
            }}
            onSubmit={values => {
                console.log(values);
            }}
        >
            {({ errors, touched, isValidating }) => (
                <Form className="flex flex-col gap-y-4 w-full">
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
                    <button className="w-full py-2 mt-4 px-3 rounded-3xl text-white bg-primary" type="submit">Đăng nhập</button>
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
