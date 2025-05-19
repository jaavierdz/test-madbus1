// pages/api/arrivals.js
import axios from 'axios';

const CLIENT_ID = 'f1aeeee7-d115-4eab-8fb0-f8b50d57fd25';
const PASS_KEY = 'B7D0ED002990C2B5B1BCE474DDFE28A83A852B06A037063B8304B78307BEE93D8046A37C3BCC546AEA0E66152ABF3C625DFE642F0D78E79B4A0670252C17CFB2';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Solo GET permitido' });
  }

  const { stopId, lineArrive } = req.query;
  if (!stopId || !lineArrive) {
    return res.status(400).json({ message: 'Faltan parámetros stopId o lineArrive' });
  }

  try {
    // 1. Login para obtener accessToken
    const loginResponse = await axios.get('https://openapi.emtmadrid.es/v1/mobilitylabs/user/login/', {
      headers: {
        'X-ClientId': CLIENT_ID,
        passKey: PASS_KEY,
      },
    });

    const accessToken = loginResponse.data.data.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'No se pudo obtener accessToken' });
    }

    // 2. Petición arrivals con el token
    const arrivalsResponse = await axios.get(
      `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stopId}/arrives/${lineArrive}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 3. Devolver la data recibida
    return res.status(200).json(arrivalsResponse.data);
  } catch (error) {
    console.error('Error en arrivals API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Error interno al obtener arrivals' });
  }
}
