import React, { useState } from 'react'
import { Modal, Button, Form, Input } from 'antd'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { SignUpRequest } from '../../pages/auth/SignUpPage'
import authService from '../../services/authService'
import { Role } from '../../enums/role'

type AddAccountDialogProps = {
    isVisible: boolean
    onClose: () => void
    fetchUsers: () => void;
    title: string;
    role: Role
}
const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ title, isVisible, onClose, fetchUsers, role }) => {
    const [loading, setLoading] = useState(false)

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
        } else {
            toast.error(response.message)
        }
    }

    return (
        <Modal
            title={
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        paddingBottom: '5px'
                    }}
                >
                    {title}
                </div>
            }
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Formik
                initialValues={{ fullName: '', email: '', password: '', confirmPassword: '', role: role }}
                validationSchema={signUpSchema}
                onSubmit={handleAddAccountAsync}
            >
                {({ errors, touched, handleChange, handleSubmit }) => (
                    <Form layout='vertical' initialValues={{
                        role: Role.USER
                    }} onFinish={handleSubmit}>
                        <Form.Item
                            label='Họ và tên'
                            validateStatus={errors.fullName && touched.fullName ? 'error' : ''}
                            help={touched.fullName && errors.fullName}
                        >
                            <Input name='fullName' onChange={handleChange} placeholder='Nhập họ và tên' />
                        </Form.Item>

                        <Form.Item
                            label='Email'
                            validateStatus={errors.email && touched.email ? 'error' : ''}
                            help={touched.email && errors.email}
                        >
                            <Input name='email' type='email' onChange={handleChange} placeholder='Nhập email' />
                        </Form.Item>

                        <Form.Item
                            label='Mật khẩu'
                            validateStatus={errors.password && touched.password ? 'error' : ''}
                            help={touched.password && errors.password}
                        >
                            <Input.Password name='password' onChange={handleChange} placeholder='Nhập mật khẩu' />
                        </Form.Item>

                        <Form.Item
                            label='Xác nhận mật khẩu'
                            validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                            help={touched.confirmPassword && errors.confirmPassword}
                        >
                            <Input.Password
                                name='confirmPassword'
                                onChange={handleChange}
                                placeholder='Nhập lại mật khẩu'
                            />
                        </Form.Item>

                       
                        <Form.Item>
                            <Button type='primary' htmlType='submit' loading={loading} block>
                                Thêm tài khoản
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AddAccountDialog
