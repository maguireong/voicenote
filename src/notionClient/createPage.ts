import fetch from "cross-fetch";

// Define function to get current published date in ISO format
const getPublishedDate = () => new Date().toISOString();

const publishUrl =
  process.env.ENV === "production"
    ? "/api/createPage"
    : `http://localhost:3000/api/createPage`; // Local API for development

export async function createPage(content: string) {
  const response = await fetch(publishUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        Date: {
          date: {
            start: getPublishedDate(),
          },
        },

        Text: {
          title: [
            {
              text: {
                content,
                link: null,
              },
            },
          ],
        },
      },
    }),
  });

  const res = await response.json();
  console.log("Got response: " + response.status);

  return response.status;
}
