import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSidebar from '../components/Admin/Layout/AdminSidebar'
import AdminDashboardMain from '../components/Admin/AdminDashboardMain'
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className='w-full flex'>
        <div className="flex items-center justify-between w-ful">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSidebar active={1} />
          </div>
          <AdminDashboardMain />
        </div>
      </div> 
    </div>
  )
}

export default AdminDashboardPage 