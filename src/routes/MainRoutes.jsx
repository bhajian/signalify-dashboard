import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const ReactTableEditable = Loadable(lazy(() => import('pages/channel/editable')));

const UserProfile = Loadable(lazy(() => import('pages/profiles/user')));
const UserTabPersonal = Loadable(lazy(() => import('sections/profiles/user/TabPersonal')));
const UserTabPayment = Loadable(lazy(() => import('sections/profiles/user/TabPayment')));
const UserTabPassword = Loadable(lazy(() => import('sections/profiles/user/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('sections/profiles/user/TabSettings')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
// render - landing page
const HomePage = Loadable(lazy(() => import('pages/home/home-page')));
const ProfilePage = Loadable(lazy(() => import('pages/profiles/user')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'home',
          element: <HomePage />
        },
        {
          path: 'profile',
          children: [
            {
              path: 'user',
              element: <UserProfile />,
              children: [
                {
                  path: 'personal',
                  element: <UserTabPersonal />
                },
                {
                  path: 'payment',
                  element: <UserTabPayment />
                },
                {
                  path: 'password',
                  element: <UserTabPassword />
                },
                {
                  path: 'settings',
                  element: <UserTabSettings />
                }
              ]
            }
          ]
        },
        {
          path: 'channel',
          children: [
            {
              path: 'all',
              element: <ReactTableEditable />
            }
          ]
        },
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;
