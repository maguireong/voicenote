import fetch from "cross-fetch";

// Define function to get current published date in ISO format
const getPublishedDate = () => new Date().toISOString();

export async function createPage(content: string) {
  const response = await fetch("http://localhost:3001/create-page", {
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
