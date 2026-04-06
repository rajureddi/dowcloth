const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

/**
 * DOWCLOTH SECURE PROXY SERVER
 * This handles the Google Vertex AI authentication securely on your machine.
 */

const app = express();
const PORT = 3000;

// Update this to your ACTUAL path!
const KEY_PATH = 'C:/Users/rajub/Downloads/docloth/docloth-17ee733e0c00.json';
const PROJECT_ID = 'docloth';
const REGION = 'us-central1';
const MODEL_ID = 'virtual-try-on-001';

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Vertex AI Auth
const auth = new GoogleAuth({
  keyFile: KEY_PATH,
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

app.post('/tryon', async (req, res) => {
  console.log('🚀 RECVEIVED TRY-ON REQUEST FROM MOBILE...');
  
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL_ID}:predict`;
    
    const payload = {
      instances: [
        {
          personImage: {
            image: {
              bytesBase64Encoded: req.body.personBase64,
            }
          },
          productImages: [
            {
              image: {
                bytesBase64Encoded: req.body.garmentBase64,
              }
            }
          ]
        }
      ],
      parameters: {
        baseSteps: 10,
      }
    };

    console.log('📡 Calling Google Vertex AI with Service Account Token...');
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`,
      },
      timeout: 60000,
    });

    console.log('✅ Google API Success! Sending result back...');
    res.json(response.data);

  } catch (error) {
    console.error('❌ SERVER ERROR:', error.message);
    if (error.response) {
      console.error('Data:', JSON.stringify(error.response.data));
    }
    res.status(500).json({ error: error.message, detail: error.response?.data });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ DowCloth Proxy Server is RUNNING at http://localhost:${PORT}`);
  console.log(`⚡ Keep this terminal open while testing the App!`);
  console.log(`-------------------------------------------------\n`);
});
