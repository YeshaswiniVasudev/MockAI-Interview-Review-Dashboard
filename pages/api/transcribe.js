// pages/api/transcribe.js
import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { audioPath } = req.body;

    exec(`python ./python_scripts/transcribe_audio.py "${audioPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: `Error transcribing: ${stderr}` });
      }
      res.status(200).json({ transcript: stdout });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
