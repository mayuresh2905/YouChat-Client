import { useFetchData } from '6pp'
import { Avatar, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { server } from '../../constants/config'
import { useErrors } from '../../hooks/hooks'
import { transformImage } from "../../lib/fetures"

const columns = [{
  field: "id",
  headerName: "ID",
  headerClassName: "table-header",
  width: 200,
},
{
  field: "avatar",
  headerName: "Avatar",
  headerClassName: "table-header",
  width: 150,
  renderCell: (params) => <Avatar alt={params.row.name} src={params.row.avatar}/>
},
{
  field: "name",
  headerName: "Name",
  headerClassName: "table-header",
  width: 200,
},
{
  field: "username",
  headerName: "Username",
  headerClassName: "table-header",
  width: 200,
},
{
  field: "friends",
  headerName: "Friends",
  headerClassName: "table-header",
  width: 150,
},
{
  field: "groups",
  headerName: "Groups",
  headerClassName: "table-header",
  width: 200,
},
]

const UserManagement = () => {

  const { loading,data,error } = useFetchData(`${server}/admin/users`,"dashboard-users");

  useErrors([{
    isError: error,
    error: error
  }])

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(data.transformedUsers.map((user) => ({...user, id: user._id, avatar: transformImage(user.avatar,50)})));
    }
   
  }, [data])
  

  return (
    <AdminLayout>
      {
        loading ? <Skeleton height={"100vh"}/> : <Table heading={"All Users"} columns={columns} rows={rows}/>
      }
    </AdminLayout>
  )
}

export default UserManagement