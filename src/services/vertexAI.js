import axios from 'axios';
import jsrsasign from 'jsrsasign';
import credentials from './credentials.json';

/**
 * 🏛️ PURE REACT JS VERTEX AI SERVICE
 * Integrated with the provided credentials.json Service Account.
 */

const PROJECT_ID = 'docloth';
const REGION = 'us-central1';
const MODEL_ID = 'virtual-try-on-001';

/**
 * 🔐 JWT GENERATION (Pure Web Edition)
 */
function generateJWT() {
  try {
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };
    return jsrsasign.jws.JWS.sign("RS256", JSON.stringify(header), JSON.stringify(payload), credentials.private_key);
  } catch (error) {
    console.error("❌ AUTH ERROR: Missing or invalid credentials.json file.", error);
    throw new Error("Missing Google Cloud Service Account Key.");
  }
}

/**
 * 🔐 ACCESS TOKEN EXCHANGE
 */
async function getAccessToken() {
  const jwt = generateJWT();
  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('assertion', jwt);

  const response = await axios.post('https://oauth2.googleapis.com/token', params.toString());
  return response.data.access_token;
}

/**
 * 📸 PURE WEB BASE64 LOADER
 */
async function toBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 🚀 DIRECT PREDICTION CALL
 */
export async function performVirtualTryOn(personImageUri, garmentImageUri, garmentCategory = 'upper body') {
  console.log('📸 STARTING VIRTUAL TRY-ON (Pure React)...');

  try {
    const accessToken = await getAccessToken();
    console.log('✅ Google Auth Successful.');

    const personBase64 = await toBase64(personImageUri);
    const garmentBase64 = await toBase64(garmentImageUri);

    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL_ID}:predict`;

    const payload = {
      instances: [
        {
          personImage: {
            image: {
              bytesBase64Encoded: personBase64,
            }
          },
          productImages: [
            {
              image: {
                bytesBase64Encoded: garmentBase64,
              },
              productImageConfig: {
                productDescription: garmentCategory
              }
            }
          ]
        }
      ],
      parameters: {
        baseSteps: 80,
      }
    };

    console.log('📡 Calling Vertex AI API...');
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      timeout: 120000,
    });

    if (response.data && response.data.predictions && response.data.predictions[0]) {
      const resultBase64 = response.data.predictions[0].bytesBase64Encoded;
      console.log('📥 Success: AI Render Received.');
      return { success: true, imageUri: `data:image/png;base64,${resultBase64}` };
    } else {
      throw new Error('API Prediction failed.');
    }

  } catch (error) {
    let errorMsg = error.message;
    if (error.response && error.response.data) {
      errorMsg = JSON.stringify(error.response.data);
    }
    console.log('❌ VTO ERROR:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
