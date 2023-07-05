/* eslint-disable no-unused-vars */
import React,{useState} from 'react';
import Navegacion from '../NavBar/Navegacion';
import Modal from '@mui/joy/Modal';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';

import ModalDialog from '@mui/joy/ModalDialog';


import Typography from '@mui/joy/Typography';
import Add from '@mui/icons-material/Add';

import Button from '@mui/joy/Button';



const CardModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navegacion/>
      <Button
        
        variant="contained" 
        color="success"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
       Precios Generales
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" component="h2">
            PRECIOS GENERALES
          </Typography>
          <Typography id="basic-modal-dialog-description" textColor="text.tertiary">
            Fill in the information of the project.
          </Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
 

    
    </>
    
  )
}

export default CardModal;