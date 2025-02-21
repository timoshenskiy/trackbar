import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { endpoint, accessToken, data } = req.body;

  try {
    console.log('Making IGDB request with token:', accessToken);
    const response = await axios.post(`https://api.igdb.com/v4/${endpoint}`, data, {
      headers: {
        'Authorization': accessToken,
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
        'Accept': 'application/json'
      }
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('IGDB API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
}
