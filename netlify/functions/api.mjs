import serverless from "serverless-http";
// Go up two levels to find the `src` directory and then the main app file
import app from "../../backend/src/index.mjs";

// This wraps your Express app so Netlify can use it
export const handler = serverless(app);
