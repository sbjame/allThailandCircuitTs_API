import { Request, Response, NextFunction } from "express";
import { updateWeatherService } from "../services/weatherService";

export const updateWeather = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateWeatherService();
    res.json({ message: "Weather updated successfully" });
  } catch (err) {
    next(err);
  }
};
