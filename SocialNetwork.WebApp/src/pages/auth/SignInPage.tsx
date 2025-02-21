import { FC, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import images from '../../assets'
import signInSchema from '../../schemas/signInSchema'
import cn from '../../utils/cn'
import authService from '../../services/authService'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import { signIn } from '../../features/slices/auth-slice'
import { Role } from '../../enums/role'
import useTitle from '../../hooks/useTitle'
import Loading from '../../components/Loading'

export type SignInRequest = {
    email: string
    password: string
}

const SignInPage: FC = () => {
    useTitle('Đăng nhập')
    const dispatch = useDispatch<AppDispatch>()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLoginAsync = async (values: SignInRequest) => {
        setLoading(true)
        const response = await authService.signIn(values)
        setLoading(false)
        if (response.isSuccess) {
            dispatch(signIn(response.data))
            if (response.data.user.role === Role.ADMIN) {
                navigate('/admin')
            } else {
                navigate('/')
            }

            toast.success(response.message)
        } else {
            toast.error(response.message)
        }
    }

    return (
        <div className='flex flex-col gap-y-6 justify-center h-full px-8 py-20'>
            {loading && <Loading title='Đang đăng nhập' />}
            <div className='flex flex-col items-center md:items-start gap-y-4 md:gap-y-0'>
                <img src={images.facebook} className='w-[40px] h-[40px] md:hidden' />
                <span className='font-bold text-2xl text-left text-sky-600'>ĐĂNG NHẬP</span>
            </div>

            <Formik<SignInRequest>
                initialValues={{
                    email: '',
                    password: ''
                }}
                onSubmit={handleLoginAsync}
                validationSchema={signInSchema}
            >
                {({ errors, touched }) => (
                    <Form className='flex flex-col gap-y-4 w-full'>
                        <div className='flex flex-col gap-y-1'>
                            <label htmlFor='email' className='mb-1 pl-3 text-[16px] font-medium text-sky-700'>
                                Email
                            </label>
                            <Field
                                name='email'
                                id='email'
                                placeholder='Địa chỉ email'
                                className={cn(
                                    'border-[1px] outline-none px-6 py-2 rounded-lg transition-all ease-linear duration-150',
                                    errors.email && touched.email ? 'border-red-500' : 'border-primary'
                                )}
                            />
                            {errors.email && touched.email && (
                                <div className='text-sm pl-3 text-red-500'>{errors.email}</div>
                            )}
                        </div>

                        <div className='flex flex-col gap-y-1'>
                            <label htmlFor='password' className='mb-1 pl-3 text-[16px] font-medium text-sky-700'>
                                Mật khẩu
                            </label>
                            <Field
                                name='password'
                                type='password'
                                id='password'
                                placeholder='Mật khẩu'
                                className={cn(
                                    'border-[1px] outline-none px-6 py-2 rounded-lg transition-all ease-linear duration-150',
                                    errors.email && touched.email ? 'border-red-500' : 'border-primary'
                                )}
                            />
                            {errors.password && touched.password && (
                                <div className='text-sm pl-3 text-red-500'>{errors.password}</div>
                            )}
                        </div>
                        <div className='w-full flex justify-end'>
                            <Link to='/forgot-password' className='text-primary font-semibold text-sm'>
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button disabled={loading} className='w-full mt-2 px-3 py-2 rounded-lg text-white bg-sky-600'>
                            Đăng nhập
                        </button>
                        <div className='flex items-center gap-x-2 justify-center'>
                            <span className='text-sm text-gray-500'>Chưa có tài khoản?</span>
                            <Link className='text-sky-600 text-sm font-bold hover:underline' to='/sign-up'>
                                Đăng kí
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInPage
