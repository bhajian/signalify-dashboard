import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


// project import
import ChannelModal from './ChannelModal';
import ChannelPreview from './ChannelPreview';
import AlertChannelDelete from './AlertChannelDelete';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

// assets
import MoreOutlined from '@ant-design/icons/MoreOutlined';


export default function SubscribeChannelCard({ channel }) {
  const [open, setOpen] = useState(false);
  const [channelModal, setChannelModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const editChannel = () => {
    setSelectedChannel(channel);
    setChannelModal(true);
  };

// ==============================|| Channel - CARD  ||============================== //

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar alt={channel.name} src={getImageUrl(`avatar-${!channel.avatar ? 1 : channel.avatar}.png`, ImagePath.USERS)} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{channel.name}</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {channel.role}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography>Asset Type: {channel?.assetType}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography>Trade Type: {channel?.tradeType}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
                {channel?.skills?.map((skill, index) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} />
                  </ListItem>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="secondary">
            Updated in {channel.time}
          </Typography>
          <Button variant="outlined" size="small" onClick={handleClickOpen}>
            Subscribe
          </Button>
        </Stack>
      </MainCard>

      <ChannelPreview channel={channel} open={open} onClose={handleClose} editChannel={editChannel} />
      <AlertChannelDelete id={channel.id} title={channel.name} open={openAlert} handleClose={handleAlertClose} />
      <ChannelModal open={channelModal} modalToggler={setChannelModal} customer={selectedChannel} />
    </>
  );
}

SubscribeChannelCard.propTypes = { channel: PropTypes.any };
