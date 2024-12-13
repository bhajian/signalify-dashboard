import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { loadStripe } from '@stripe/stripe-js';

import axios from 'axios'; // Ensure axios is imported
const stripePromise = loadStripe("pk_live_51QULjG07n7BY3VpocvtX5kNskuA0idIfDnO6GlMo6rcETMFcN86UC1G2uFhUXhFgnMAVgEtKAmjrPMU9o1zNkeLh00SgVJIPjw");

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function LandingPage() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/channel/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('serviceToken')}` // Replace with your JWT token handling
          }
        });
        setChannels(response.data.channels);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    fetchChannels();
  }, []);

  const handleSubscribe = async (channelId, priceId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3001/api/payment/subscribe',
        { channelId, priceId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('serviceToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { sessionId } = response.data;
      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error during subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Landing Card">
      <Grid container spacing={3}>
      {channels.map((channel) => (
        <Grid item xs={12} sm={6} md={4} key={channel._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{channel.name}</Typography>
              <Typography variant="body2">Price: ${channel.price}</Typography>
              <Typography variant="body2">Type: {channel.assetType}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubscribe(channel._id, channel.priceId)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </MainCard>
  );
}
