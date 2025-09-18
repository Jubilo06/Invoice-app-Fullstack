import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoUploader from './LogoUpLoader';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';

function ProfilePage() {
  const { user, updateUserProfile, deleteAccount, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    firstName: '', lastName: '', companyName: '', companyAddress: '', companyLogo: null, /* ...etc */
  });
  const [isSaving, setIsSaving] = useState(false);

  // Syncs the form with the user data from the context when the page loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        companyName: user.companyName || '',
        companyAddress: user.companyAddress || '',
        companyLogo: user.companyLogo || null,
        
    });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (newLogoDataUrl) => {
    setProfileData(prev => ({ ...prev, companyLogo: newLogoDataUrl }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(profileData);
      alert('Profile updated successfully!');
      // Optional: navigate somewhere else, e.g., back to the dashboard
      // navigate('/dashboard');
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account and all data?')) {
      try {
        await deleteAccount();
        alert('Account deleted.');
        navigate('/'); // Redirect to homepage after deletion
      } catch (error) {
        alert(`Deletion failed: ${error.message}`);
      }
    }
  };

  if (isLoading || !user) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleUpdate} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Your Profile</Typography>
      
      {/* Inputs for firstName, lastName, companyName, etc. */}
      <TextField name="firstName" label="First Name" value={profileData.firstName} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="lastName" label="Last Name" value={profileData.lastName} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="companyName" label="Company Name" value={profileData.companyName} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="companyAddress" label="Company Address" value={profileData.companyAddress} onChange={handleChange} fullWidth margin="normal" />
      
      <LogoUploader currentLogo={profileData.companyLogo} onLogoChange={handleLogoChange} />

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Profile Changes'}
      </Button>

      {/* Danger Zone for Deletion */}
      <Box sx={{ mt: 5, p: 2, border: '1px solid red', borderRadius: 1 }}>
        <Typography variant="h6" color="error">Delete Account</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Typography>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete My Account Permanently
        </Button>
      </Box>
    </Box>
  );
}

export default ProfilePage;