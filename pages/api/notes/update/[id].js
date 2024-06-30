export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  const { title, description } = req.body;

  try {
    // Here you would implement your database update logic
    const response = await fetch(
      `https://service.pace-unv.cloud/api/notes/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      }
    );
    const result = await response.json();
    console.log("result => ", result);

    // Return a success response
    res.status(200).json(result);
  } catch (error) {
    // Handle error
    console.error("Error updating note:", error);
    res.status(500).json({ success: false, error: "Failed to update note" });
  }
}
