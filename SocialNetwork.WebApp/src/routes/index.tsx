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
import GroupPendingInvitesPage from '../pages/groups/GroupPendingInvitesPage'
import GroupMemberDetailPage from '../pages/groups/GroupMemberDetailPage'
import GroupMyPendingInvitesPage from '../pages/groups/GroupMyPendingInvitesPage'
import GroupMyPostPage from '../pages/groups/post/GroupMyPostPage'
import GroupMyPendingPostPage from '../pages/groups/post/GroupMyPendingPostPage'
import GroupMyRejectedPostPage from '../pages/groups/post/GroupMyRejectedPostPage'
import GroupMyAcceptedPostPage from '../pages/groups/post/GroupMyAcceptedPostPage'
import SearchUserPage from '../pages/search/SearchUserPage'
import SearchPostPage from '../pages/search/SearchPostPage'
import SearchGroupPage from '../pages/search/SearchGroupPage'
import SearchTopPage from '../pages/search/SearchTopPage'
import PostPageManagement from '../pages/admin/posts/PostPageManagement'
import PostDetailPage from '../pages/admin/posts/PostDetailPage'
import GroupPageManagement from '../pages/admin/groups/GroupPageManagement'
import GroupDetailPage from '../pages/admin/groups/GroupDetailPage'
import UserPageManagement from '../pages/admin/users/UserPageManagement'
import UserDetailPage from '../pages/admin/users/UserDetailPage'
import ReportPageManagement from '../pages/admin/reports/ReportPageManagement'
import AdminStatisticsPage from '../pages/admin/statistics/AdminStatisticsPage'
import AdminAccountPage from '../pages/admin/AdminAccountPage'

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
        element: <AdminGuard element={<AdminLayout />} />,
        children: [
            {
                path: '',
                element: <AdminStatisticsPage />
            },
            {
                path: 'posts',
                element: <PostPageManagement />,
            },
            {
                path: 'posts/:postId',
                element: <PostDetailPage />
            },
            {
                path: 'groups',
                element: <GroupPageManagement />,
            },
            {
                path: 'groups/:groupId',
                element: <GroupDetailPage />,
            },
            {
                path: 'users',
                element: <UserPageManagement />,
            },
            {
                path: 'accounts',
                element: <AdminAccountPage />,
            },
            {
                path: 'users/:userId',
                element: <UserDetailPage />,
            },
            {
                path: 'reports',
                element: <ReportPageManagement />,
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
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<GroupManagerLayout />} />,
        children: [
            {
                path: 'feeds',
                element: <GroupFeedSharedPage />
            },
            {
                path: 'my-pending-invites',
                element: <GroupMyPendingInvitesPage />
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
                        path: 'my-content',
                        element: <GroupMyPostPage />,
                        children: [
                            {
                                path: 'posted',
                                element: <GroupMyAcceptedPostPage />
                            },
                            {
                                path: 'rejected',
                                element: <GroupMyRejectedPostPage />
                            },
                            {
                                path: 'pending',
                                element: <GroupMyPendingPostPage />
                            }
                        ]
                    },
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
                        element: <GroupPendingInvitesPage />
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
        path: '/search',
        errorElement: <ErrorBoundaryPage />,
        element: <AuthGuard element={<SearchLayout />} />,
        children: [

            {
                path: 'top',
                element: <SearchTopPage />
            },
            {
                path: 'user',
                element: <SearchUserPage />
            },
            {
                path: 'post',
                element: <SearchPostPage />
            },
            {
                path: 'group',
                element: <SearchGroupPage />
            },
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
