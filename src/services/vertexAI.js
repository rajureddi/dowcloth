import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import jsrsasign from 'jsrsasign';

/**
 * FINAL DIRECT VERTEX AI IMPLEMENTATION (No Proxy Server)
 * Integrated with the provided 'vertex-express' Service Account.
 */

const PROJECT_ID = 'docloth';
const REGION = 'us-central1';
const MODEL_ID = 'virtual-try-on-001';

const SERVICE_ACCOUNT = {
  client_email: "vertex-express@docloth.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDpZGCqhTB/712A\nEHuVdULfmslrviSehK4vf+cyEyyO1K1rP4AgqQ2dJ0zQMDHGHUvNPuTRP6nqUudh\nal+J2nMlXHTxDClQghSO72Ti+JG7xoTa1ZRCkspbkw3O0LIyFIGmg+VoWCNAaRKa\ndYrLK+/TY9mFG2CyWeebm0aWvK5PSCOpeP6KxFIxRON7Lh2nQ3G99BkMRbGSfvPQ\n01dEBW1lD18YTrOlHleayBSWvhjwTnN22TxJt1UxJaUDabvebBcGpkz/XJZ88/TM\nbT1TCCfViyu3jJgA+8XfBngo0dMjlWYXkpI5CM8SaimxMyshws6qEY6ysqL/QIIB\nsCZMyRg3AgMBAAECggEAPZZ9Y8IN0FTL6ZVv5zqwUO05pbLhWutMQ8COs8oXggFh\nWeHB39x8eTH7tRxiphLpA9pK62TPY8RIxo4Zc/kvVXaWbV12MYaCAk3t428QleqG\n+HBP1VmDCLM/e4na3BhJNjWr/eL0OnT/sb6+x2pquO+qYNOeqrHKymcpM3HK1aSE\npFPitFH4Haxa7JHj+3mJHB8FxtLUMRasNi1PSvsd1QqW722VuZCPfgfhHATXHSYx\nLLjxBqOUTbzuOmUClrYOZxZOPoRHpzvVeB8i4tkbSrWJZtg5UEQvRcRoTUzQa35I\ndzFJ3DwdZpqfAq0Z5lkLJ2su+ehOeXo8JOUBL6/8wQKBgQD74INk5e0AMwDjwbyL\n2yyo3ZculIeSEAXTs8ChSxBsKaRC+c9EfF7J0hzchpzMDTZeCw0Y0QK2igeCGca5\nB+DAtYeKdDYdZeRQjMruHBr7ljCp+vu2RT1JMU8KwiDKNLAYmBBwR0bcWoN4xbwF\nlK2ZJbD4wWzZzKxMusuonGsEJwKBgQDtNmdUbEE2lWzQ9qBeLKPgY2zYYYeLe4/u\noUT1ns1DEp2Wep9zUQmNY+aIJdTuPO2JGz0eD1SBgFh9VpjIV2h5j233Ba4nNUQ1\n99xpD33pqse4aZ3RLTNJwfEgsn69MojBj1nadCu8Bq5yMiHnTHCUVk5QLOizO78G\nAnT3HvyFcQKBgQD594ZuzAC5AeUQI2ULJyjbLY6sG5uvyVb/EpVJfUV/EpSCI4kf\nXo5znKIn+TADEdmy2yTUTBl1LubkptAhMUBL/9vT/CD4a/Z6Oj/qrtnYdOU2zG6i\nJXT8/oKDGsWP51ocDk3CH/qjFPEFGrfOkg72vgEz3kI4pHcabwdO/mz2YQKBgBSm\nPL57of2nak6SeYlZJ3bcENiRPORmgDQMs90R0tp432D/EaxPLJ6zSJknee63PRJH\nXb2lJf0T+CAJDsm52i1iz/bF9tAQ8fwktHos0BAsPrCN+SABaEqOaHgpMaE0qfT3\njqHWpQv8JOlp9cuVuuMe1DhkgGlB1TInupjciKzxAoGBALgfAKzw/H9KGPhL94le\npMDX5hZZdjDwzb5Pyv5MclE8EP+DXyOPHcQKmaxs776VAoP1JV0gcyOHPqWbF7Fb\negv1ONvO7k57/Z+YelAYJvDHndeoWtpg28lKhUDJ/8Kq0GKxkSacr7M1JEDGzXfz\nJuKCxEoLVyrJoPrjCYLbieJ7\n-----END PRIVATE KEY-----\n"
};

/**
 * 🔐 JWT GENERATION
 */
function generateJWT() {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: SERVICE_ACCOUNT.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  return jsrsasign.jws.JWS.sign("RS256", JSON.stringify(header), JSON.stringify(payload), SERVICE_ACCOUNT.private_key);
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
 * 🚀 DIRECT PREDICTION CALL
 */
export async function performVirtualTryOn(personImageUri, garmentImageUri, garmentCategory = 'upper body') {
  console.log('📸 STARTING DIRECT VIRTUAL TRY-ON...');
  console.log('📍 Garment Description:', garmentCategory);
  
  try {
    const accessToken = await getAccessToken();
    console.log('✅ Google Auth Successful.');

    const personBase64 = await FileSystem.readAsStringAsync(personImageUri, { encoding: 'base64' });
    const garmentBase64 = await FileSystem.readAsStringAsync(garmentImageUri, { encoding: 'base64' });

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

    console.log('📡 Calling Vertex AI Prediction API...');
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      timeout: 120000,
    });

    if (response.data && response.data.predictions && response.data.predictions[0]) {
      const resultBase64 = response.data.predictions[0].bytesBase64Encoded;
      console.log('📥 Success: Received AI Prediction Result.');
      return { success: true, imageUri: `data:image/png;base64,${resultBase64}` };
    } else {
      throw new Error('API Prediction failed to return bytes.');
    }

  } catch (error) {
    let errorMsg = error.message;
    if (error.response && error.response.data) {
      errorMsg = JSON.stringify(error.response.data);
    }
    console.log('❌ VTO DIRECT ERROR:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
