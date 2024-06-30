// pages/api/notes/delete/[id].js

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  if (req.method === "DELETE") {
    try {
      const response = await fetch(
        `https://service.pace-unv.cloud/api/notes/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete note" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
