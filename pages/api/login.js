import axios from 'axios';

export default async function handler(req, res) {
  const CLIENT_ID = 'f1aeeee7-d115-4eab-8fb0-f8b50d57fd25';
  const PASS_KEY = 'B7D0ED002990C2B5B1BCE474DDFE28A83A852B06A037063B8304B78307BEE93D8046A37C3BCC546AEA0E66152ABF3C625DFE642F0D78E79B4A0670252C17CFB2';

  try {
    const response = await axios.get(
      'https://openapi.emtmadrid.es/v2/mobilitylabs/user/login/',
      {},
      {
        headers: {
          'X-ClientId': CLIENT_ID,
          passKey: PASS_KEY,
        },
      }
    );

    const token = response.data.data[0].accessToken;
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
