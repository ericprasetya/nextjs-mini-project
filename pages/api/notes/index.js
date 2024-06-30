export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response = await fetch("https://service.pace-unv.cloud/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const notes = await response.json();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (req.method === "POST") {
    const { title, description } = req.body;

    try {
      const createdNote = {
        title,
        description,
      };

      // Return a success response
      res.status(201).json({ success: true, data: createdNote });
    } catch (error) {
      // Handle error
      console.error("Error creating note:", error);
      res.status(500).json({ success: false, error: "Failed to create note" });
    }
  } else {
    // Handle other HTTP methods
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
