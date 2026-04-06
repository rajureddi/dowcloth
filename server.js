const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const jsrsasign = require('jsrsasign');

const app = express();
const PORT = 3000;

// Path to your service account key
const KEY_PATH = 'C:/Users/rajub/Downloads/docloth/DowClothApp/src/services/service-account.json';

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/tryon', async (req, res) => {
  console.log('🚀 RECEIVED TRY-ON REQUEST LOCALLY...');
  
  try {
    // 🛡️ Load Credentials
    const credentials = require(KEY_PATH);
    const PROJECT_ID = credentials.project_id;
    const REGION = 'us-central1';
    const MODEL_ID = 'virtual-try-on-001';

    // 1. Generate JWT (Stable)
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };
    const jwt = jsrsasign.jws.JWS.sign("RS256", JSON.stringify(header), JSON.stringify(payload), credentials.private_key);

    // 2. Get Access Token
    const authParams = new URLSearchParams();
    authParams.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    authParams.append('assertion', jwt);
    const authRes = await axios.post('https://oauth2.googleapis.com/token', authParams.toString());
    const accessToken = authRes.data.access_token;

    // 3. Call Vertex AI
    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL_ID}:predict`;
    const predictPayload = {
      instances: [{
        personImage: { image: { bytesBase64Encoded: req.body.personBase64 } },
        productImages: [{
           image: { bytesBase64Encoded: req.body.garmentBase64 },
           productImageConfig: { productDescription: req.body.garmentCategory || 'upper body' }
        }]
      }],
      parameters: { baseSteps: 80 }
    };

    console.log(`📡 Calling Vertex AI for Project: ${PROJECT_ID}...`);
    const aiResponse = await axios.post(endpoint, predictPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      timeout: 120000,
    });

    console.log('✅ AI Render Success!');
    res.json(aiResponse.data);

  } catch (error) {
    console.error('❌ LOCAL SERVER ERROR:', error.message);
    const detail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    res.status(500).json({ error: detail });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ DowCloth Stable Proxy is RUNNING at http://localhost:${PORT}`);
  console.log(`-------------------------------------------------\n`);
});
