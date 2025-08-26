import { Request, Response, NextFunction } from "express";
import { Circuit } from "../models/Circuit";
import { upload } from "../middlewares/multer";
import cloudinary from "../utils/cloudinary";

//!Real All Circuit
export const getCircuit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const circuits = await Circuit.find({ isDelete: { $ne: true } });
    res.json(circuits);
  } catch (err) {
    next(err);
  }
};

//!Create Circuit
// export const createCircuit = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const circuit = await Circuit.create(req.body);
//     res.status(201).json(circuit);
//   } catch (err) {
//     next(err);
//   }
// };

//!Create Circuit with images
export const createCircuit = async (req: Request, res: Response) => {
  try {
    const files = req.files as { 
      [fieldname: string]: Express.Multer.File[] 
    };

    const uploadedImagesUrls: string[] = [];
    let uploadedThumbnail = "";

    // Upload images (array)
    if (files.images) {
      for (const file of files.images) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "circuits/images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        uploadedImagesUrls.push(result.secure_url);
      }
    }

    // Upload thumbnail (single)
    if (files.thumbnail && files.thumbnail.length > 0) {
      const thumbFile = files.thumbnail[0];
      if(!thumbFile) throw new Error("Thumbnail file missing");
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "circuits/thumbnails" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(thumbFile.buffer);
      });
      uploadedThumbnail = result.secure_url;
    }

    const circuit = new Circuit({
      name: req.body.name,
      location_coords: {
        lat: req.body.location_coords.lat,
        lon: req.body.location_coords.lon,
      },
      location_url: req.body.location_url,
      length_km: req.body.length_km,
      type: req.body.type,
      images: uploadedImagesUrls,
      thumbnail: uploadedThumbnail,
    });

    await circuit.save();

    res.status(201).json({ message: "Created Circuit", circuit });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//!Update Circuit
export const updateCircuit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingCircuit = await Circuit.findById(id);
    if (!existingCircuit)
      return res.status(404).json({ error: "Cirscuit not found" });

    const invalidField = Object.keys(updateData).find(
      (key) => !Object.keys(Circuit.schema.obj).includes(key)
    );
    if (invalidField) return res.status(400).json({ error: `Invalid field` });

    const updatedCircuit = await Circuit.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    res.json(updatedCircuit);
  } catch (err) {
    next(err);
  }
};

//!Delete Circuit
export const deleteCircuit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const circuit = await Circuit.findById(id);
    if (!circuit || circuit.isDelete)
      return res.status(404).json({ error: "Circuit not found" });

    circuit.isDelete = true;
    circuit.deleteAt = new Date();

    await circuit.save();
    res.json({ message: "Circuit soft Deleted", circuit });
  } catch (err) {
    next(err);
  }
};
