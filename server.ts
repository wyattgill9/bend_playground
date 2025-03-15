import { serve, sleep } from "bun";

const server = serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }
    
    if (url.pathname === "/run" && req.method === "POST") {
      try {
        const text = await req.text();

        const id = (Date.now());
        
        try {
            console.log("Raw request:", text); // Log the raw input
            const data = JSON.parse(text); 
            const path = "./temp/" + id + ".bend";
            await Bun.write(path, data.code);
            console.log("Code written to file:", path);

            console.log(path);

            // Change this to the directory you cloned the repository into
            const bend_result = await Bun.spawn(["/home/wyattgill/.cargo/bin/bend", "run", 
                path
            ]);
            await sleep(1000);

        } catch (e) {
            console.error("Error during JSON parsing or execution:", e);
            console.log("Failed to parse JSON. Raw request:");
            console.log(text);
        }
        

        return new Response(
          JSON.stringify({ message: "Code received by server" }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } catch (error) {
        console.error("Error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to process request" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    return new Response("Not found", { 
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  },
});

console.log(`Server running at http://localhost:3000`);
console.log(`Waiting for code submissions...`);