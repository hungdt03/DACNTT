import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../features/slices/auth-slice'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'
import AccessDeniedPage from '../pages/errors/AccessDeniedPage'
import { Role } from '../enums/role'

type AdminGuardProps = {
    element: React.ReactNode
}

const AdminGuard: FC<AdminGuardProps> = ({ element }) => {
    const { isAuthenticated, isInitialized, user } = useSelector(selectAuth)
    useEffect(() => {
        console.log(user)
    }, [user])
    if (!isInitialized) return <Loading />

    if (!isAuthenticated) {
        return <Navigate to='/sign-in' replace />
    }

    if (user?.role !== Role.ADMIN) {
        return <AccessDeniedPage />
    }

    return element
}

export default AdminGuard
