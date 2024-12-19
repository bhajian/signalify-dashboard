import { useState, useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import { DebouncedInput } from 'components/third-party/react-table';
import ChannelCard from 'sections/channel/ChannelCard';
import CustomerModal from 'sections/channel/ChannelModal';

import usePagination from 'hooks/usePagination';
import { useGetChannels } from 'api/channel';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';

// ==============================|| Channel - CARD ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'ID'
  },
  {
    id: 2,
    header: 'Channel Name'
  },
  {
    id: 3,
    header: 'Asset Type'
  },
  {
    id: 4,
    header: 'Trade Type'
  },
  {
    id: 5,
    header: 'Platform'
  },
  {
    id: 6,
    header: 'Owner'
  },
  {
    id: 7,
    header: 'Price'
  },
  {
    id: 8,
    header: 'Status'
  }
];

function dataSort(data, sortBy) {
  return data.sort(function (a, b) {
    if (sortBy === 'Channel Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Asset Type') return a.assetType.localeCompare(b.assetType);
    if (sortBy === 'Trade Type') return a.tradeType.localeCompare(b.tradeType);
    if (sortBy === 'Platform') return b.platformType.localeCompare(b.platformType);
    if (sortBy === 'Owner') return a.ownerSub.localeCompare(b.ownerSub);
    if (sortBy === 'Status') return a.status.localeCompare(b.status);
    if (sortBy === 'Price') return a.price.localeCompare(b.price);
    return a;
  });
}

export default function ChannelCardPage() {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const { channels: lists } = useGetChannels();

  const [sortBy, setSortBy] = useState('Default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [channelModal, setChannelModal] = useState(false);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  // search
  useEffect(() => {
    setCustomerLoading(true);
    if (lists && lists.length > 0) {
      const newData = lists.filter((value) => {
        if (globalFilter) {
          return value.name.toLowerCase().includes(globalFilter.toLowerCase());
        } else {
          return value;
        }
      });
      setUserCard(dataSort(newData, sortBy).reverse());
      setCustomerLoading(false);
    }
  }, [globalFilter, lists, sortBy]);

  const PER_PAGE = 6;

  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <DebouncedInput
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Search ${userCard.length} records...`}
            />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Sort By</Typography>;
                    }
                    return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setChannelModal(true)}>
                Add Channel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {!customerLoading && userCard.length > 0 ? (
          _DATA.currentData().map((channel, index) => (
            <Slide key={index} direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                <ChannelCard channel={channel} />
              </Grid>
            </Slide>
          ))
        ) : (
          <EmptyUserCard title={customerLoading ? 'Loading...' : 'You have not created any channel yet.'} />
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>
      <CustomerModal open={channelModal} modalToggler={setChannelModal} />
    </>
  );
}
