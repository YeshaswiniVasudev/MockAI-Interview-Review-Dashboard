// Import necessary modules
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Define the type for the audio data
type AudioData = {
  id: number;
  title: string;
  duration: number;
  date: string;
  path: string;
  transcript: string;
};

// Define the API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Define the path to the JSON file with the audio data
  const filePath = path.join(process.cwd(), "data/mockData.json");
  // Read the JSON file
  const fileData = fs.readFileSync(filePath);
  // Parse the JSON file into an array of AudioData objects
  const data: AudioData[] = JSON.parse(fileData.toString());

  // Extract the id from the query parameters
  const { id } = req.query;

  // Find the audio with the given id
  const audio = data.find((audio: AudioData) => audio.id === Number(id));

  // If the audio was not found, return a 404 status and an error message
  if (!audio) {
    res.status(404).json({ message: "Audio not found" });
    return;
  }

  // If the audio was found, return a 200 status and the audio data
  res.status(200).json(audio);
}
