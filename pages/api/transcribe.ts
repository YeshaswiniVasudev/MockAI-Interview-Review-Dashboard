
// Import necessary modules
import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

// Define the API handler
export default function handler(req : NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Extract the audioPath from the request body
    const { audioPath } = req.body;

    // Execute the Python script to transcribe the audio
    exec(`python ./python_scripts/transcribe_audio.py "${audioPath}"`, (error, stdout, stderr) => {
      // If there is an error, log it and return a 500 status with the error message
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: `Error transcribing: ${stderr}` });
      }
      // If there is no error, return a 200 status with the transcript
      res.status(200).json({ transcript: stdout });
    });
  } else {
    // If the request method is not POST, return a 405 status and an error message
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
