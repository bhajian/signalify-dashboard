import { useEffect, useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

// project-imports
import FormCustomerAdd from './FormChannelAdd';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { handlerCustomerDialog, useGetChannels, useGetCustomerMaster } from 'api/channel';

const closeModal = () => handlerCustomerDialog(false);

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export default function AddCustomer() {
  const { customerMasterLoading, customerMaster } = useGetCustomerMaster();
  const { customersLoading: loading, customers } = useGetChannels();

  const [list, setList] = useState(null);

  const isModal = customerMaster?.modal;

  useEffect(() => {
    if (customerMaster?.modal && typeof customerMaster.modal === 'number') {
      const newList = customers.filter((info) => info.id === isModal && info)[0];
      setList(newList);
    } else {
      setList(null);
    }
    // eslint-disable-next-line
  }, [customerMaster]);

  const customerForm = useMemo(
    () => !loading && !customerMasterLoading && <FormCustomerAdd customer={list} closeModal={closeModal} />,
    [list, loading, customerMasterLoading]
  );

  return (
    <>
      {isModal && (
        <Modal
          open={true}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{
            '& .MuiPaper-root:focus': {
              outline: 'none'
            }
          }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar
              sx={{
                maxHeight: `calc(100vh - 48px)`,
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              {loading && customerMasterLoading ? (
                <Box sx={{ p: 5 }}>
                  <Stack direction="row" justifyContent="center">
                    <CircularWithPath />
                  </Stack>
                </Box>
              ) : (
                customerForm
              )}
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}