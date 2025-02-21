import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_SECRET,
      grant_type: 'client_credentials'
    });

    // Return token with Bearer prefix
    res.status(200).json({
      ...response.data,
      access_token: `Bearer ${response.data.access_token}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token' });
  }
}
