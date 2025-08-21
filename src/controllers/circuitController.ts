import { Request, Response, NextFunction } from "express";
import { Circuit } from "../models/Circuit";
import { error } from "console";

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
export const createCircuit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const circuit = await Circuit.create(req.body);
    res.status(201).json(circuit);
  } catch (err) {
    next(err);
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
    if (invalidField)
      return res
        .status(400)
        .json({ error: `There is no ${invalidField} field` });

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
    console.log("sdafsadfsdf")
    const circuit = await Circuit.findById(id);
    if (!circuit || circuit.isDelete) {
      return res.status(404).json({ error: "Circuit not found" });
    }

    circuit.isDelete = true;
    circuit.deleteAt = new Date();

    await circuit.save();
    res.json({ message: "Circuit soft Deleted", circuit });
  } catch (err) {
    next(err);
  }
};
