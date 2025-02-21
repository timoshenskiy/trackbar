import axios from "axios";

const API_URL = "https://api.open-meteo.com/v1/forecast";
export const apiGetAuth = (lat: string, lon: string) =>
  axios.get(
    `${API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,rain,snowfall,cloud_cover,wind_speed_10m,wind_gusts_10m`
  );
