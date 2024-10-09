import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from './components/auth/ProtectedRoute';
import { LayoutLaoder } from './components/layout/Loaders';
import axios from 'axios';
import { server } from './constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from './socket';

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/not-found"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessagesManagement = lazy(() => import("./pages/admin/MessageManagement"));



const App = () => {

  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
     
     axios
       .get(`${server}/user/me`,{ withCredentials: true})
       .then(({ data })=> dispatch(userExists(data.user)))
       .catch((err) => dispatch(userNotExists()));

  },[dispatch]);



  return loader ? <LayoutLaoder /> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLaoder />}>
      <Routes>
        <Route element={
          <SocketProvider>
            <ProtectedRoute user={user}/>
          </SocketProvider>
      }>
          <Route path="/" element={<Home />}/>
          <Route path="/chat/:chatId" element={<Chat />}/>
          <Route path="/groups" element={<Groups />}/>
        </Route>
       
        <Route 
          path="/login" 
          element={
            <ProtectedRoute user={!user} redirect="/">
              <Login />
            </ProtectedRoute>
          }/>
          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element = {<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />

          
        <Route path='*' element= {<NotFound />} />
      </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </BrowserRouter>
  )
}

export default App;