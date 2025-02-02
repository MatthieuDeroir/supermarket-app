import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { User } from '@common/defs/types/user';

interface UserDetailsModalProps {
  user: User;
  show: boolean;
  onHide: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, show, onHide }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User>(user);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Add your update logic here
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Add your delete logic here
    onHide();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={show} onClose={onHide}>
      <DialogTitle>Stock Log Details</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', width: 400, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={userData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="contained" onClick={onHide}>
              Return
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
