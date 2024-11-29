import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Feeds from "../pages/Feeds";
import GroupPage from "../pages/GroupPage";
import HeaderOnlyLayout from "../layouts/HeaderOnlyLayout/HeaderOnlyLayout";
import ProfilePage from "../pages/ProfilePage";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import ChatLayout from "../layouts/ChatLayout/ChatLayout";
import ChatPage from "../pages/ChatPage";

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Feeds />
            }
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: 'sign-in',
                element: <SignInPage />
            },
            {
                path: 'sign-up',
                element: <SignUpPage />
            }
        ]
    },
    {
        path: '/',
        element: <HeaderOnlyLayout />,
        children: [
            {
                path: 'groups',
                element: <GroupPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            },
        ]
    },
    {
        path: '/chat',
        element: <ChatLayout />,
        children: [
            {
                path: ':id',
                element: <ChatPage />
            }
        ]
    },
])

export default appRouter;