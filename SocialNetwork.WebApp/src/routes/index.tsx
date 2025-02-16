import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import HomePage from '../pages/HomePage'
import GroupHomePage from '../pages/groups/GroupHomePage'
import ProfilePage from '../pages/ProfilePage'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import SignInPage from '../pages/auth/SignInPage'
import SignUpPage from '../pages/auth/SignUpPage'
import ChatPage from '../pages/ChatPage'
import AuthGuard from './authGuard'
import NotFoundPage from '../pages/errors/NotFoundPage'
import GuestGuard from './guestGuard'
import ErrorBoundaryPage from '../pages/errors/ErrorBoundaryPage'
import CreateStoryPage from '../pages/CreateStoryPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ViewStoryPage from '../pages/ViewStoryPage'
import GroupManagerLayout from '../layouts/GroupManagerLayout/GroupManagerLayout'
import CreateGroupPage from '../pages/groups/CreateGroupPage'
import HeaderFullWidthLayout from '../layouts/HeaderFullWidthLayout/HeaderFullWidthLayout'
import GroupFeedSharedPage from '../pages/groups/GroupFeedSharedPage'
import SearchPage from '../pages/SearchPage'
import SearchLayout from '../layouts/SearchLayout/SearchLayout'
import GroupLayout from '../layouts/GroupLayout/GroupLayout'
import GroupPendingMembers from '../pages/groups/GroupPendingMembers'
import GroupPendingPosts from '../pages/groups/GroupPendingPosts'
import GroupMemberPage from '../pages/groups/GroupMemberPage'
import GroupImagePage from '../pages/groups/GroupImagePage'
import GroupVideoPage from '../pages/groups/GroupVideoPage'
import GroupPendingReports from '../pages/groups/GroupPendingReports'
import HeaderOnlyLayout from '../layouts/HeaderOnlyLayout/HeaderOnlyLayout'
import FriendLayout from '../layouts/FriendLayout/FriendLayout'
import FriendRequestsPage from '../pages/friends/FriendRequestsPage'
import SuggestedFriendPage from '../pages/friends/SuggestedFriendPage'
import AdminLayout from '../layouts/AdminLayout/AdminLayout'
import AdminGuard from './adminGuard'
import GroupPendingInvites from '../pages/groups/GroupPendingInvites'
import GroupMemberDetailPage from '../pages/groups/GroupMemberDetailPage'

const appRouter = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<MainLayout />} />,
        children: [
            {
                path: '',
                element: <HomePage />
            }
        ]
    },
    {
        errorElement: <ErrorBoundaryPage />,
        path: '/admin',
        element: <AdminGuard element={<AdminLayout />} />
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
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<GroupManagerLayout />} />,
        children: [
            {
                path: 'feeds',
                element: <GroupFeedSharedPage />
            }
        ]
    },
    {
        errorElement: <ErrorBoundaryPage />,
        path: '/groups/create',
        element: <CreateGroupPage />
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
                        path: 'pending-invites',
                        element: <GroupPendingInvites />
                    },
                    {
                        path: 'pending-posts',
                        element: <GroupPendingPosts />
                    },
                    {
                        path: 'pending-reports',
                        element: <GroupPendingReports />
                    },
                    {
                        path: 'user/:userId',
                        element: <GroupMemberDetailPage />
                    }
                ]
            },
            {
                path: 'profile/:id/:tab?',
                element: <ProfilePage />
            }
        ]
    },
    {
        errorElement: <ErrorBoundaryPage />,
        path: '/friends',
        element: <AuthGuard element={<FriendLayout />} />,
        children: [
            {
                path: 'requests',
                element: <FriendRequestsPage />
            },
            {
                path: 'suggests',
                element: <SuggestedFriendPage />
            }
        ]
    },
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<HeaderOnlyLayout />} />,
        children: []
    },
    {
        path: '/',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<SearchLayout />} />,
        children: [
            {
                path: 'search',
                element: <SearchPage />
            }
        ]
    },
    {
        path: '/chat/:id',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<ChatPage />} />
    },
    {
        errorElement: <ErrorBoundaryPage />,
        path: '/stories/create',
        element: <CreateStoryPage />
    },
    {
        errorElement: <ErrorBoundaryPage />,
        path: '/stories/:userId',
        element: <ViewStoryPage />
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

export default appRouter
