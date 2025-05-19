import axios from 'axios';

export default async function handler(req, res) {
  const { stopId, line } = req.query;

  if (!stopId) {
    return res.status(400).json({ error: 'Falta parámetro stopId' });
  }

  try {
    // Primero pedir token (podrías cachearlo para no pedir siempre)
    const CLIENT_ID = 'f1aeeee7-d115-4eab-8fb0-f8b50d57fd25';
    const PASS_KEY = 'B7D0ED002990C2B5B1BCE474DDFE28A83A852B06A037063B8304B78307BEE93D8046A37C3BCC546AEA0E66152ABF3C625DFE642F0D78E79B4A0670252C17CFB2';

    const loginResp = await axios.post(
      'https://openapi.emtmadrid.es/v1/mobilitylabs/user/login/',
      {},
      {
        headers: {
          'X-ClientId': CLIENT_ID,
          passKey: PASS_KEY,
        },
      }
    );

    const token = loginResp.data.data[0].accessToken;

    // Construir URL arrivals según si line está o no
    let url = '';
    if (line) {
      url = `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stopId}/arrives/${line}/`;
    } else {
      url = `https://openapi.emtmadrid.es/v1/transport/busemtmad/stops/arrives/`;
    }

    // Si no line, POST con stopIds array
    let resp;
    if (line) {
      resp = await axios.get(url, {
        headers: { accessToken: token },
      });
    } else {
      resp = await axios.post(
        url,
        { stopIds: [parseInt(stopId)] },
        { headers: { accessToken: token } }
      );
    }

    res.status(200).json(resp.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}