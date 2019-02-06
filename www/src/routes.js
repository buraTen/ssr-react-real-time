import Home from './pages/Home';
import User from './pages/User';
import Messages from './pages/Messages';
import Search from './pages/Search';

export default [
    {
        path: '/',
        component: Home,
        requireAuth: true,
        exact: true
    },
    {
        path: '/messages',
        component: Messages,
        requireAuth: true,
        exact: true
    },
    {
        path: '/user/:username',
        component: User,
        exact: false
    },
    {
        path: '/search/:query',
        component: Search,
        exact: true
    }
];