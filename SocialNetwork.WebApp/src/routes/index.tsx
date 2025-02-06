import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import HomePage from "../pages/HomePage";
import GroupHomePage from "../pages/groups/GroupHomePage";
import ProfilePage from "../pages/ProfilePage";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ChatPage from "../pages/ChatPage";
import AuthGuard from "./authGuard";
import NotFoundPage from "../pages/errors/NotFoundPage";
import GuestGuard from "./guestGuard";
import ErrorBoundaryPage from "../pages/errors/ErrorBoundaryPage";
import CreateStoryPage from "../pages/CreateStoryPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ViewStoryPage from "../pages/ViewStoryPage";
import GroupManagerLayout from "../layouts/GroupManagerLayout/GroupManagerLayout";
import CreateGroupPage from "../pages/groups/CreateGroupPage";
import HeaderFullWidthLayout from "../layouts/HeaderFullWidthLayout/HeaderFullWidthLayout";
import GroupFeedSharedPage from "../pages/groups/GroupFeedSharedPage";
import SearchPage from "../pages/SearchPage";
import SearchLayout from "../layouts/SearchLayout/SearchLayout";
import GroupLayout from "../layouts/GroupLayout/GroupLayout";
import GroupPendingMembers from "../pages/groups/GroupPendingMembers";
import GroupPendingPosts from "../pages/groups/GroupPendingPosts";
import GroupMemberPage from "../pages/groups/GroupMemberPage";
import GroupImagePage from "../pages/groups/GroupImagePage";
import GroupVideoPage from "../pages/groups/GroupVideoPage";

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
        path: '/groups',
        element: <AuthGuard element={<GroupManagerLayout />} />,
        children: [
            {
                path: 'feeds',
                element: <GroupFeedSharedPage />
            }
        ]
    },
    {
        path: '/groups/create',
        element: <CreateGroupPage />,
        
    },  
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<HeaderFullWidthLayout />} />,
        children: [
            {
                path: 'groups/:id',
                element: <GroupLayout />,
                children: [
                    {
                        path: '',
                        element: <GroupHomePage />
                    },
                    {
                        path: 'images',
                        element: <GroupImagePage />
                    },
                    {
                        path: 'videos',
                        element: <GroupVideoPage />
                    },
                    {
                        path: 'members',
                        element: <GroupMemberPage />
                    },
                    {
                        path: 'pending-members',
                        element: <GroupPendingMembers />
                    },
                    {
                        path: 'pending-posts',
                        element: <GroupPendingPosts />
                    }
                ]
            },
            {
                path: 'profile/:id/:tab?',
                element: <ProfilePage />
            },
        ]
    },
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<SearchLayout />} />,
        children: [
            {
                path: 'search',
                element: <SearchPage />
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