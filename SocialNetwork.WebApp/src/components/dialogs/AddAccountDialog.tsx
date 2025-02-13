import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'antd'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { SignUpRequest } from '../../pages/auth/SignUpPage'
import authService from '../../services/authService'

type AddAccountDialogProps = {
    isVisible: boolean
    onClose: () => void
    fetchUsers: () => void
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ isVisible, onClose, fetchUsers }) => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const signUpSchema = Yup.object().shape({
        fullName: Yup.string().required('Họ và tên không được để trống'),
        email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
        password: Yup.string().required('Mật khẩu không được để trống'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Mật khẩu xác nhận không khớp')
            .required('Xác nhận mật khẩu không được để trống')
    })

    const handleAddAccountAsync = async (values: SignUpRequest) => {
        setLoading(true)
        const response = await authService.signUp(values)
        setLoading(false)
        if (response.isSuccess) {
            fetchUsers()
            toast.success('Thêm tài khoản thành công')
            onClose()
            setEmail(values.email)
        } else {
            toast.error(response.message)
        }
    }

    return (
        <Modal title='Thêm tài khoản' open={isVisible} onCancel={onClose} footer={null}>
            <Formik
                initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={signUpSchema}
                onSubmit={handleAddAccountAsync}
            >
                {({ errors, touched, handleChange }) => (
                    <Form className='flex flex-col gap-y-4 w-full'>
                        <Field name='fullName' placeholder='Họ và tên' className='input-field' />
                        {errors.fullName && touched.fullName && <div className='error-text'>{errors.fullName}</div>}

                        <Field
                            name='email'
                            type='email'
                            placeholder='Địa chỉ email'
                            className='input-field'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e)
                                setEmail(e.target.value)
                            }}
                        />
                        {errors.email && touched.email && <div className='error-text'>{errors.email}</div>}

                        <Field name='password' type='password' placeholder='Mật khẩu' className='input-field' />
                        {errors.password && touched.password && <div className='error-text'>{errors.password}</div>}

                        <Field
                            name='confirmPassword'
                            type='password'
                            placeholder='Xác nhận mật khẩu'
                            className='input-field'
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                            <div className='error-text'>{errors.confirmPassword}</div>
                        )}

                        <Button htmlType='submit' type='primary' loading={loading}>
                            Đăng ký
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AddAccountDialog
