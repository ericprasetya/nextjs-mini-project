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
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (req.method === "POST") {
    try {
      console.log("Request body:", req.body);

      const response = await fetch("https://service.pace-unv.cloud/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body), // Ensure the body is correctly stringified
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const result = await response.json();
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ success: false, error: "Failed to create note" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
