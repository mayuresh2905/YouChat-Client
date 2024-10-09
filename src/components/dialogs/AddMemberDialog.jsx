import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../../constants/sampleData';
import UserItem from '../shared/UserItem'; 
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';

const AddMemberDialog = ({chatId}) => {

    const dispatch = useDispatch();

    const { isAddMember } = useSelector((state) => state.misc);

    const { isLoading,data,isError,error} = useAvailableFriendsQuery(chatId);

    const [selectedMembers,setSelectedMembers] = useState([]);

    const [addMember, isLoadingAddMember] = useAsyncMutation(useAddGroupMembersMutation);
  
    const selectMemberHandler = (id) => {
      setSelectedMembers((prev)=> (prev.includes(id)? prev.filter((currElement) => currElement !== id) : [...prev,id]))
    };

    
    const addMemberSubmitHandler = () => {
        addMember("Adding Members...",{ members: selectedMembers, chatId})
         closeHandler();
    }

    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    }

    useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"0.5rem"}>
                {isLoading ? <Skeleton /> : data?.friends?.length > 0 ?(
                    data?.friends?.map((i) => (
                        <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
                    ))) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )
                }
            </Stack>
           <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
           <Button color='error' onClick={closeHandler}>Cancel</Button>
           <Button variant='contained' disabled={isLoadingAddMember} onClick={addMemberSubmitHandler}>Add</Button>
           </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog;