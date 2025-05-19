// /pages/api/login.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { data } = await axios.get(
      'https://openapi.emtmadrid.es/v1/mobilitylabs/user/login/',
      {},  // body vacío según docs
      {
        headers: {
          'X-ClientId': 'f1aeeee7-d115-4eab-8fb0-f8b50d57fd25',
          'passKey': 'B7D0ED002990C2B5B1BCE474DDFE28A83A852B06A037063B8304B78307BEE93D8046A37C3BCC546AEA0E66152ABF3C625DFE642F0D78E79B4A0670252C17CFB2',
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
