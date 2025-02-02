import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { StockLogsType } from '@common/defs/types/logs';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface LogDetailsModalProps {
  stockLog: StockLogsType;
  show: boolean;
  onHide: () => void;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ stockLog, show, onHide }) => {
  return (
    <Dialog open={show} onClose={onHide} fullWidth sx={{ padding: 2 }}>
      <DialogTitle>Stock Log Details</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          ID:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.id}
          </Box>
        </Typography>
        <Typography variant="body1">
          EAN:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.ean}
          </Box>
        </Typography>
        <Typography variant="body1">
          Type:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.type}
          </Box>
        </Typography>
        <Typography variant="body1">
          De:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.de}
          </Box>
        </Typography>
        <Typography variant="body1">
          Pour:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.pour}
          </Box>
        </Typography>
        <Typography variant="body1">
          Quantité:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.qt}
          </Box>
        </Typography>
        <Typography variant="body1">
          Date:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {dayjs(stockLog.date).format('DD/MM/YYYY HH[h]mm')}
          </Box>
        </Typography>
        <Typography variant="body1">
          Par:{' '}
          <Box component="span" sx={{ fontWeight: '700' }}>
            {stockLog.par}
          </Box>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onHide} startIcon={<ArrowBackIcon />}>
          Retourner
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogDetailsModal;
