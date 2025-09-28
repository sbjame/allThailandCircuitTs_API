import { Request, Response, NextFunction } from "express";
import { Circuit } from "../models/Circuit";
import { upload } from "../middlewares/multer";
import cloudinary from "../utils/cloudinary";

//!Read All Circuit
export const getCircuit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const circuits = await Circuit.find({ isDelete: false});
    res.json(circuits);
  } catch (err) {
    next(err);
  }
};

//!Create Circuit with images
export const createCircuit = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const uploadedImagesUrls: string[] = [];
    let uploadedThumbnail = "";

    const uploadToCloudinary = (file: Express.Multer.File, folder: string) => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    };

    if (files.images) {
      for (const file of files.images) {
        const uploaded = await uploadToCloudinary(file, "circuits/images");
        uploadedImagesUrls.push(uploaded.secure_url);
      }
    }

    if (files.thumbnail && files.thumbnail.length > 0) {
      const thumbFile = files.thumbnail[0];
      if (!thumbFile) throw new Error("Thumbnail file missing");

      const uploaded = await uploadToCloudinary(
        thumbFile,
        "circuits/thumbnails"
      );
      uploadedThumbnail = uploaded.secure_url;
    }
    const circuit = new Circuit({
      name: req.body.name,
      location_coords: {
        lat: parseFloat(req.body.lat),
        lon: parseFloat(req.body.lon),
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
    console.error("Upload error:", error);
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
    if (!existingCircuit) {
      return res.status(404).json({ error: "Circuit not found" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    //! ฟังก์ชันอัปโหลดไป Cloudinary
    const uploadToCloudinary = (file: Express.Multer.File, folder: string) => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer); // ต้องใช้ multer.memoryStorage()
      });
    };

    const updateOps: any = {};

    //! --- Remove thumbnail ถ้ามี flag ---
    if (updateData.removeThumbnail === "true") {
      if (!updateOps.$set) updateOps.$set = {};
      updateOps.$set.thumbnail = "";
      existingCircuit.thumbnail = "";
    }

    //! --- Upload thumbnail ใหม่ ---
    if (files?.thumbnail && files.thumbnail.length > 0) {
      const thumbFile = files.thumbnail[0] as Express.Multer.File;
      const uploadedThumb = await uploadToCloudinary(
        thumbFile,
        "circuits/thumbnails"
      );
      if (!updateOps.$set) updateOps.$set = {};
      updateOps.$set.thumbnail = uploadedThumb.secure_url;
    }

    //! --- จัดการ images รวม ลบและเพิ่มพร้อมกัน ---
    let finalImages = [...existingCircuit.images];

    //! ลบรูปที่ต้องการลบ
    if (updateData.removeImages) {
      let imgsToRemove: string[] = [];
      try {
        imgsToRemove = JSON.parse(updateData.removeImages);
      } catch {
        imgsToRemove = [updateData.removeImages];
      }
      finalImages = finalImages.filter((img) => !imgsToRemove.includes(img));
    }

    //! อัปโหลดรูปใหม่
    if (files?.images && files.images.length > 0) {
      const uploadedImages: string[] = [];
      for (const file of files.images) {
        const uploaded = await uploadToCloudinary(file, "circuits/images");
        uploadedImages.push(uploaded.secure_url);
      }
      finalImages = [...finalImages, ...uploadedImages];
      if (finalImages.length > 5) {
        return res
          .status(400)
          .json({ error: "Maximum of 5 images allowed per circuit." });
      }
    }

    //! ตั้งค่า images ใน updateOps
    if (!updateOps.$set) updateOps.$set = {};
    updateOps.$set.images = finalImages;

    const validFields = Object.keys(Circuit.schema.obj);
    for (const key of Object.keys(updateData)) {
      if (
        validFields.includes(key) &&
        key !== "images" &&
        key !== "thumbnail" &&
        key !== "removeImages" &&
        key !== "removeThumbnail"
      ) {
        if (!updateOps.$set) updateOps.$set = {};
        updateOps.$set[key] = updateData[key];
      }
    }

    const updatedCircuit = await Circuit.findByIdAndUpdate(id, updateOps, {
      new: true,
      runValidators: true,
    });

    res.json(updatedCircuit);
  } catch (err) {
    console.error("Update error:", err);
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
