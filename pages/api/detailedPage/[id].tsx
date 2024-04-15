import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Assuming you have a type for your audio data
type AudioData = {
  id: number;
  title: string;
  duration: number;
  date: string;
  path: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data/mockData.json');
  const fileData = fs.readFileSync(filePath);
  const data: AudioData[] = JSON.parse(fileData.toString());

  const { id } = req.query;

  const audio = data.find((audio: AudioData) => audio.id === Number(id));

  if (!audio) {
    res.status(404).json({ message: 'Audio not found' });
    return;
  }

  res.status(200).json(audio);
}