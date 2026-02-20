import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { memo, useCallback, useState } from 'react';
import { useAuthStore } from '../../stores/auth';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = memo(function LoginDialog({ open, onClose }: LoginDialogProps) {
  const { setWorkerApiKey } = useAuthStore();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setError('');
  }, []);

  const handleApiKeyToggle = useCallback(() => {
    setShowApiKey(prev => !prev);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setError('API key is required');
      return;
    }

    setWorkerApiKey(trimmedKey);
    setApiKey('');
    onClose();
  }, [apiKey, setWorkerApiKey, onClose]);

  const handleClose = useCallback(() => {
    setApiKey('');
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Worker API Key Required</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Please enter your Worker API key to access the research features. This key will be saved
          securely in your browser cookies.
        </DialogContentText>

        <Box>
          <TextField
            required
            fullWidth
            variant="outlined"
            size="medium"
            label="Worker API Key"
            type={showApiKey ? 'text' : 'password'}
            placeholder="Enter your Worker API key"
            autoComplete="off"
            value={apiKey}
            onChange={handleApiKeyChange}
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <IconButton size="small" onClick={handleApiKeyToggle}>
                  {showApiKey ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!apiKey.trim()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default LoginDialog;
