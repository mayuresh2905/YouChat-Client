import React, { useState } from 'react';
import { Container, Paper, TextField, Typography,Button, Stack, Avatar, IconButton } from"@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import { usernameValidator } from '../utils/validators';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userExists } from "../redux/reducers/auth";
import toast from 'react-hot-toast';
import { server } from '../constants/config';


const Login = () => {
  const [isLogin,setIsLogin] = useState(true);
  const [isLoading,setIsLoading] = useState(false)

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In....");

    setIsLoading(true);

    const config = {
       withCredentials: true,
       headers: {
        "Content-Type": "application/json"
       }
    };

    try {
      const { data } = await axios.post(
        `${server}/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId =toast.loading("Signing In....");

    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
       "Content-Type": "multipart/form-data"
      }
   };

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    try {
      const { data } = await axios.post(
        `${server}/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId
      });
    } catch (error) {  
      toast.error(error?.response?.data?.message || "Something went Wrong", {
        id: toastId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("",usernameValidator);
  const password = useInputValidation("");
  // const password = useStrongPassword();
  const avatar = useFileHandler("single");
  return (
    <div 
     style={{
      background: "linear-gradient(rgb(255 225 209), rgb(249 159 159))"
     }}
     >
      <Container 
      component={"main"} 
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      >
          <Paper 
            elevation={3}
            sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent:"center"
            }}
            >
                { isLogin?
                  <>
                    <Typography variant="h5">Login</Typography>
                    <form style={{
                      width:"100%",
                      marginTop:"1rem"
                    }} 
                    onSubmit={handleLogin}
                    >
                        <TextField 
                          required 
                          fullWidth
                          label="Username"
                          margin="normal"
                          variant='outlined'
                          value={username.value}
                          onChange={username.changeHandler}
                        />
                        {
                          username.error && (
                            <Typography color="error" variant='caption'>
                              {username.error}
                            </Typography>
                          )
                        }
                        <TextField 
                          required 
                          fullWidth
                          label="Password"
                          type="password"
                          margin="normal"
                          variant="outlined"
                          value={password.value}
                          onChange={password.changeHandler}
                        />
                        <Button
                         sx={{
                            marginTop: "1rem"
                         }} 
                         fullWidth
                         variant ="contained"
                         color="primary"
                         type="Submit"
                         disabled={isLoading}
                        >
                            Login
                        </Button>
                        <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                        <Button
                         
                         fullWidth 
                         variant ="text"
                         onClick = {toggleLogin}
                        >
                            Sign Up Instead
                        </Button>
                    </form>
                  </>:
                  <>
                  <Typography variant="h5">Sign Up</Typography>
                  <form style={{
                    width:"100%",
                    marginTop:"1rem"
                  }}
                   onSubmit={handleSignUp}
                  >
                    <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                      <Avatar sx={{
                        width: "10rem",
                        height: "10rem",
                        objectFit: "contain"
                      }}
                      src={avatar.preview}
                      />
                     
                      <IconButton 
                        sx={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          color: "white",
                          bgcolor: "rgba(0,0,0,0.5)",
                          ":hover": {
                            bgcolor: "rgba(0,0,0,0.7)",
                          },
                        }}

                        component="label"
                      >
                         <>
                           <CameraAltIcon />
                           <VisuallyHiddenInput 
                             type='file'
                             onChange={avatar.changeHandler}
                             />
                         </>
                        </IconButton> 
                    </Stack>
                    {
                      avatar.error && (
                         <Typography
                            m={"1rem auto"}
                            width={"fit-content"}
                            display={"block"}
                            color="error"
                            variant="caption"
                            >
                            {avatar.error}
                         </Typography>
                       )}
                      <TextField 
                        required 
                        fullWidth
                        label="Name"
                        margin="normal"
                        variant='outlined'
                        value={name.value}
                        onChange={name.changeHandler}
                      />
                      <TextField 
                        required 
                        fullWidth
                        label="Bio"
                        margin="normal"
                        variant='outlined'
                        value={bio.value}
                        onChange={bio.changeHandler}
                      />
                      <TextField 
                        required 
                        fullWidth
                        label="Username"
                        margin="normal"
                        variant='outlined'
                        value={username.value}
                        onChange={username.changeHandler}
                      />
                       {
                          username.error && (
                            <Typography color="error" variant='caption'>
                              {username.error}
                            </Typography>
                          )
                        }
                      <TextField 
                        required 
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        variant='outlined'
                        value={password.value}
                        onChange={password.changeHandler}
                      />
                      {
                        password.error && (
                         

                          <Typography color="error" variant='caption'>
                              {password.error}
                            </Typography>

                  
                        )
                      }
                      <Button
                       sx={{
                          marginTop: "1rem"
                       }} 
                       fullWidth
                       variant ="text"
                       type='submit'
                       disabled={isLoading}
                      
                      >
                          Sign Up
                      </Button>
                      <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                      <Button
                       
                       fullWidth 
                       variant ="contained"
                       color='primary'
                       type='Submit'
                       onClick = {toggleLogin}
                      >
                          Login Instead
                      </Button>
                  </form>
                </>
                }
            </Paper>
    </Container>
    </div>
    
  )
}

export default Login