export const getSteamLoginUrl = () => {
  const returnUrl = `${window.location.origin}/api/auth/steam/callback`;
  const steamLoginUrl = `https://steamcommunity.com/openid/login?${new URLSearchParams(
    {
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.mode": "checkid_setup",
      "openid.return_to": returnUrl,
      "openid.realm": window.location.origin,
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    }
  )}`;
  return steamLoginUrl;
};

export const getUserGames = async (steamId: string) => {
  const response = await fetch(`/api/steam/games?steamId=${steamId}`);
  return response.json();
};
