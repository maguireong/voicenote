const fetch = require("cross-fetch");

const NOTION_TOKEN = "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";
const DATABASE_ID = "12e726ebeb6f80258371c7dd12c94f9d";

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      // Send a request to the Notion API to create a new page
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: DATABASE_ID },
          properties: req.body.properties,
        }),
      });

      // Parse the response from Notion API
      const data = await response.json();

      // Send the data back to the client
      res.status(200).json(data);
    } catch (error) {
      console.error("Error creating page in Notion:", error);
      res.status(500).json({ error: "Failed to create page in Notion" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).send("Method Not Allowed");
  }
};
