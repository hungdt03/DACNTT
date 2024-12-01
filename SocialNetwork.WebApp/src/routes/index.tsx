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
import AuthGuard from "./authGuard";
import NotFoundPage from "../pages/errors/NotFoundPage";
import GuestGuard from "./guestGuard";

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <AuthGuard element={<MainLayout />} />,
        children: [
            {
                path: '',
                element: <Feeds />
            }
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
            }
        ]
    },
    {
        path: '/',
        element: <AuthGuard element={<HeaderOnlyLayout />} />,
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
        element: <AuthGuard element={<ChatLayout />} />,
        children: [
            {
                path: ':id',
                element: <ChatPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

export default appRouter;