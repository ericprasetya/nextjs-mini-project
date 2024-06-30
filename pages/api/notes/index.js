// pages/api/notes.js

export default async function handler(req, res) {
  try {
    const response = await fetch("https://service.pace-unv.cloud/api/notes");
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const notes = await response.json();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
