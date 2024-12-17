import React from 'react'
import UserInbox from './UserInbox'
import ProfileSidebar from '../components/Profile/ProfileSidebar'
const InboxPage = () => {
  return (
    <div>
        <ProfileSidebar active={4} />
      <UserInbox />
    </div>
  )
}

export default InboxPage
