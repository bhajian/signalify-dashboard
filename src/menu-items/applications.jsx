// third-party
import { FormattedMessage } from 'react-intl';

// assets
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import AppstoreAddOutlined from '@ant-design/icons/AppstoreAddOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
// type

// icons
const icons = {
  MessageOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  CustomerServiceOutlined,
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    // {
    //   id: 'chat',
    //   title: <FormattedMessage id="chat" />,
    //   type: 'item',
    //   url: '/apps/chat',
    //   icon: icons.MessageOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'user-profile',
          title: <FormattedMessage id="user-profile" />,
          type: 'item',
          link: '/profile',
          url: '/profile/user/personal',
          breadcrumbs: false
        },
      ]
    },
    // {
    //   id: 'channel-table',
    //   title: <FormattedMessage id="channel-table" />,
    //   type: 'collapse',
    //   icon: icons.MessageOutlined,
    //   children: [
    //     {
    //       id: 'channels',
    //       title: <FormattedMessage id="channels" />,
    //       type: 'item',
    //       link: '/channel',
    //       url: '/channel/all',
    //       breadcrumbs: false
    //     },
    //   ]
    // },
    {
      id: 'customer',
      title: <FormattedMessage id="Channels" />,
      type: 'collapse',
      icon: icons.CustomerServiceOutlined,
      children: [
        {
          id: 'customer-card',
          title: <FormattedMessage id="Channel List" />,
          type: 'item',
          url: '/channel/list'
        }
      ]
    },
    {
      id: 'signal',
      title: <FormattedMessage id="Signals" />,
      type: 'collapse',
      icon: icons.MessageOutlined,
      children: [
        {
          id: 'customer-card',
          title: <FormattedMessage id="Signal" />,
          type: 'item',
          url: '/signal/list'
        }
      ]
    },
  ]
};

export default applications;
