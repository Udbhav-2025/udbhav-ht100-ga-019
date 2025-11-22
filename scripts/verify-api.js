const axios = require('axios');

async function verify() {
  try {
    console.log('Fetching campaigns...');
    const response = await axios.get('http://localhost:3002/api/campaigns');
    const campaigns = response.data.campaigns;

    if (campaigns.length === 0) {
      console.log('No campaigns found.');
      return;
    }

    const campaign = campaigns[0];
    console.log(`Latest Campaign ID: ${campaign._id}`);
    console.log(`Status: ${campaign.status}`);

    if (campaign.errorMessage) {
      console.log(`Error Message: ${campaign.errorMessage}`);
    }

    // Check status endpoint
    const statusResponse = await axios.get(`http://localhost:3002/api/campaigns/${campaign._id}/status`);
    console.log(`Status Endpoint: ${statusResponse.data.status}`);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

verify();
