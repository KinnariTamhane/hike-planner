import mongoose, { Schema, Document } from "mongoose";

export interface IHike extends Document {
  title: string;
  country: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert";
  distance: number;
  description: string;
  images: string[];
  elevation: number;
  duration: string;
  bestSeason: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const HikeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Hard", "Expert"],
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    elevation: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    bestSeason: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Hike || mongoose.model<IHike>("Hike", HikeSchema);
