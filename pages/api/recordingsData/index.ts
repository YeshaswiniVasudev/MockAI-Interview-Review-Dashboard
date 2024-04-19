// Import necessary modules
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Define the API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Define the path to the JSON file with the data
  const filePath = path.join(process.cwd(), "data/mockData.json");
  // Read the JSON file
  const fileData = fs.readFileSync(filePath);
  // Parse the JSON file into an object
  const data = JSON.parse(fileData.toString());
  // Return a 200 status and the data
  res.status(200).json(data);
}
