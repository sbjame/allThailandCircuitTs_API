import mongoose, { Document, Schema } from "mongoose";

export interface ICircuit extends Document {
  name: string;
  location_coords: {
    lat: { type: Number; require: true };
    lon: { type: Number; require: true };
  };
  location_url: string;
  length_km: Number;
  type: string;
  weather_daily: {
    maxTemp_c: Number;
    minTemp_c: Number;
    maxTemp_f: Number;
    minTemp_f: Number;
    avgTemp_c: Number;
    avgTemp_f: Number;
    maxWind_mps: Number;
    chanceOfRain: Number;
  };
  isDelete?: boolean;
  deleteAt?: Date;
  updated_at: Date;
}

const CircuitSchema: Schema = new Schema<ICircuit>({
  name: {
    type: String,
    required: true,
  },
  location_coords: {
    lat: { type: Number, require: true },
    lon: { type: Number, require: true },
  },
  length_km: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Automotive", "Kart"],
    required: true,
  },
  location_url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/(www\.)?(google\.[a-z]+\/maps|maps\.app\.goo\.gl)\/.+/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid Google Maps URL!`,
    },
  },
  weather_daily: {
    maxTemp_c: {type: Number, default: 0},
    minTemp_c: {type: Number, default: 0},
    maxTemp_f: {type: Number, default: 0},
    minTemp_f: {type: Number, default: 0},
    avgTemp_c: {type: Number, default: 0},
    avgTemp_f: {type: Number, default: 0},
    maxWind_mps: {type: Number, default: 0},
    chanceOfRain: {type: Number, default: 0},
  },
  isDelete: { type: Boolean, default: false },
  deleteAt: { type: Date },
  updated_at: { type: Date, default: Date.now },
});

export const Circuit = mongoose.model<ICircuit>("Circuit", CircuitSchema);
