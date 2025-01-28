import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import HomePage from "../pages/HomePage";
import GroupPage from "../pages/GroupPage";
import HeaderOnlyLayout from "../layouts/HeaderOnlyLayout/HeaderOnlyLayout";
import ProfilePage from "../pages/ProfilePage";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import ChatPage from "../pages/ChatPage";
import AuthGuard from "./authGuard";
import NotFoundPage from "../pages/errors/NotFoundPage";
import GuestGuard from "./guestGuard";
import ErrorBoundaryPage from "../pages/errors/ErrorBoundaryPage";
import CreateStoryPage from "../pages/CreateStoryPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ViewStoryPage from "../pages/ViewStoryPage";
import GroupManagerLayout from "../layouts/GroupManagerLayout/GroupManagerLayout";
import CreateGroupPage from "../pages/CreateGroupPage";

const appRouter = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<MainLayout />} />,
        children: [
            {
                path: '',
                element: <HomePage />
            },
        ]
    },
    {
        path: '/',
        element: <GuestGuard element={<AuthLayout />} />,
        children: [
            {
                path: 'sign-in',
                element: <SignInPage />
            },
            {
                path: 'sign-up',
                element: <SignUpPage />
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage />
            }
        ]
    },
    {
        path: '/group-manager',
        element: <AuthGuard element={<GroupManagerLayout />} />,
        children: [
           
        ]
    },
    {
        path: '/groups/create',
        element: <CreateGroupPage />,
        
    },  
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<HeaderOnlyLayout />} />,
        children: [
            {
                path: 'groups/:id',
                element: <GroupPage />
            },
            {
                path: 'profile/:id',
                element: <ProfilePage />
            },
        ]
    },
    {
        path: '/chat/:id',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<ChatPage />} />,
    },
    {
        path: '/stories/create',
        element: <CreateStoryPage />
    },
    {
        path: '/stories/:userId',
        element: <ViewStoryPage />
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

export default appRouter;