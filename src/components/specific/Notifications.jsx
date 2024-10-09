import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useAcceptFreindRequestMutation, useGetNotificationsQuery } from '../../redux/api/api';
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {

  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const {isLoading, data ,error,isError} = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFreindRequestMutation);

  const friendRequestHandler = async ({_id,accept}) => {

    dispatch(setIsNotification(false));
    await acceptRequest("Accepting Request...",{requestId: _id, accept})
  
  };

  const closeHandler = () => dispatch(setIsNotification(false))

  useErrors([{ error, isError}]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem"}} width={"35rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? (
            <Skeleton />
          ) : (
            <>
             {
               data?.allRequests.length > 0 ? (
               data?.allRequests?.map((i) => (
                  <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>
                 ))
               ) :( 
                   <Typography textAlign={"center"}>0 Notifications</Typography>
                 )
             }
            </>
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({sender,_id,handler}) => {

  const {name,avatar} = sender;


  return (
    <ListItem>
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
        <Avatar />
        <Typography variant='body1' sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%"
        }}>{`${name} sent you friend request`}</Typography>
       <Stack direction={{
          xs: "column",
          sm: "row",
       }}>
        <Button onClick={() => handler({_id,accept: true})}>Accept</Button>
        <Button color='error' onClick={() => handler({_id,accept: false})}>Reject</Button>
       </Stack>
    </Stack>
</ListItem>
  )
})

export default Notifications