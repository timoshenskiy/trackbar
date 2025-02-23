import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  console.log('Environment variables check:', {
    clientIdExists: !!clientId,
    clientIdValue: clientId,
    clientSecretExists: !!clientSecret,
    clientSecretLength: clientSecret?.length,
    nodeEnv: process.env.NODE_ENV
  });

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { 
        error: 'Missing credentials',
        details: {
          clientId: clientId ? 'present' : 'missing',
          clientSecret: clientSecret ? 'present' : 'missing'
        }
      },
      { status: 500 }
    );
  }

  try {
    const tokenUrl = 'https://id.twitch.tv/oauth2/token';
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    });

    console.log('Making token request to:', tokenUrl);
    console.log('With params:', params.toString());

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Token response:', {
      status: response.status,
      data: response.data
    });

    return NextResponse.json({
      access_token: `Bearer ${response.data.access_token}`
    });
  } catch (error: any) {
    console.error('Token Error Details:', {
      message: error.message,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      },
      request: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });

    return NextResponse.json(
      { 
        error: 'Failed to get access token',
        details: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
}
