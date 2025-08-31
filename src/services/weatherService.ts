import axios from "axios";
import { Circuit } from "../models/Circuit";
import { Request, Response, NextFunction } from "express";

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";


export const updateWeatherService = async (): Promise<void> => {
  const circuits = await Circuit.find();

  for (const circuit of circuits) {
    const { lat, lon } = circuit.location_coords;

    if (!lat || !lon) {
      console.log(`Missing lat/lon for circuit: ${circuit.name}`);
      continue;
    }

    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
      },
    });

    const forecast = response.data.forecast.forecastday[0].day;

    circuit.weather_daily = {
      maxTemp_c: forecast.maxtemp_c,
      minTemp_c: forecast.mintemp_c,
      maxTemp_f: forecast.maxtemp_f,
      minTemp_f: forecast.mintemp_f,
      avgTemp_c: forecast.avgtemp_c,
      avgTemp_f: forecast.avgtemp_f,
      maxWind_mps: (forecast.maxwind_kph * 0.277777778).toFixed(2),
      chanceOfRain: forecast.daily_chance_of_rain,
    };

    await circuit.save();
    console.log(`Updated ${circuit.name}`);
  }
};