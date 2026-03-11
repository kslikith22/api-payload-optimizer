# API Payload Optimizer

A production-ready npm package that structurally accelerates API responses by reducing JSON payload weight by **up to ~95%** while seamlessly maintaining application integrations using Native Fetch!

This package transparently adaptive-encodes and compresses JSON API responses. Small responses remain unchanged, medium APIs get encoded to lightweight highly-dense binary formats, and large payloads are heavily compressed using advanced algorithmic stream compression.

## Requirements

- Node.js 18+
- Use Node core `fetch` or a compatible 18+ runtime when requesting using the client.

## Installation

```bash
npm install api-payload-optimizer
```

## Features

- **Adaptive Optimization**:
  - `< 5 KB`: Sent as plain JSON.
  - `5–50 KB`: Encoded via **High-Density Binary Serialization**.
  - `> 50 KB`: Encoded via **Binary Serialization** and Compressed via **Advanced Stream Compression**.
- **Extreme Compression**: Reduces highly-complex payloads by **up to ~95%** (e.g. 3.5 MB nested JSON compressed natively down to ~240 KB).
- **Universal CommonJS & ESM Support**: Automatically works with `import` or `require()`.
- **Express Middleware Support** built-in.
- **Universal Fetch Wrapper** unbinds decoding complexities and resolves underlying metadata natively.

## Examples

### Using raw Node.js Server or Express Utilities

On your server, import the `sendOptimized` utility (supports both ESM and CommonJS):

```javascript
// ESM
import { sendOptimized } from "api-payload-optimizer";

// CommonJS
// const { sendOptimized } = require("api-payload-optimizer");
```

const app = express();

app.get("/users", (req, res) => {
const users = [
{ id: 1, name: "Alice", active: true },
{ id: 2, name: "Bob", active: false },
// ... potentially thousands of users
];

// sendOptimized automatically compresses depending on the payload magnitude
sendOptimized(res, users);
});

app.listen(3000, () => console.log("Server is running"));

````

### Express Middleware Syntax

```javascript
import express from "express";
import { optimizedMiddleware } from "api-payload-optimizer";

const app = express();

// Apply middleware to attach sendOptimized to all responses
app.use(optimizedMiddleware);

app.get("/users", (req, res) => {
  const users = [
    /* your dataset */
  ];
  res.sendOptimized(users);
});
````

### Requesting on Client

On the requesting client (must be Node 18+ or standard browsers), simply use the `fetchOptimized` utility which performs automated recursive decompression and binary decoding out-of-the-box. Let the package interpret the headers automatically!

The function structurally resolves an object containing both your raw unpacked `data` and the network's exact `compression` bytes sizes natively.

```javascript
import { fetchOptimized } from "api-payload-optimizer/client";

async function fetchUsers() {
  try {
    // Works identically to native `fetch()`, simply awaits natively!
    const { data: users, compression } = await fetchOptimized(
      "http://localhost:3000/users",
    );

    // Evaluate standard compression performances!
    console.log(
      `Payload Transfer Size: ${compression.compressedBytes / 1024} KB`,
    );
    console.log("Optimized result:", users);
  } catch (err) {
    console.error("Request failed:", err);
  }
}

fetchUsers();
```

## Contributing

Feel free to open an issue or pull request into API Payload Optimizer for additional features or optimizations.

## License

MIT License
