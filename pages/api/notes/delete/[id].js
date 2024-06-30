// pages/api/notes/delete/[id].js

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  if (req.method === "DELETE") {
    try {
      // Replace with your actual delete logic
      // For example, assuming `id` is used to delete from a database
      const result = { success: true, message: `Deleted note with id ${id}` };
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete note" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
