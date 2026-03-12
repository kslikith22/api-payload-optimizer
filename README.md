# API Payload Optimizer 🚀

An ultra-lightweight (**~20KB**) production-grade wrapper that structurally accelerates Node.js API responses by shrinking massive JSON datasets by **up to ~95%**!

Using highly-optimized binary serialization and algorithmic streaming, `api-payload-optimizer` compresses your complex nested data before it ever hits the wire—slashing bandwidth costs without sacrificing latency.

---

## 🏎️ The Benchmark

In a live React web application fetching **2,000 highly complex nested User objects**:

| Metric                      | Standard JSON | Optimized Engine | Difference       |
| :-------------------------- | :------------ | :--------------- | :--------------- |
| **Network Transfer Size**   | `3,418 KB`    | `243 KB`         | **~93% Smaller** |
| **Loaded Raw Uncompressed** | `3,418 KB`    | `3,418 KB`       | Identical Data   |

---

## 📦 Features

- **Ultra-Lightweight**: Only ~20KB added to your `node_modules`.
- **Intelligent Encoding**: Automatically determines if short data should stay JSON or if large data should be heavily compressed based on byte size thresholds.
- **Universal Types**: Native JS Dates, Maps, and Buffers are natively preserved over the network!
- **Drop-in Replacement**: Takes `2 lines` of code on the server and `1 line` of code on the client.

---

## 🛠️ Installation

```bash
npm install api-payload-optimizer
```

_(Works with standard `node` and modern bundlers like `vite`, `webpack`, and `esbuild`.)_

---

## 🔌 1. Server Setup (Express.js)

Attach the middleware globally (or onto specific routes), and then simply replace `res.json(data)` with `res.sendOptimized(data)`.

```javascript
import express from "express";
import { optimizedMiddleware } from "api-payload-optimizer";

const app = express();

// 1. Attach the Global Middleware
app.use(optimizedMiddleware);

app.get("/api/users", async (req, res) => {
  const hugeDataset = await database.getUsers();

  // 2. Transmit heavily compressed data instantly!
  res.sendOptimized(hugeDataset);
});

app.listen(3000);
```

---

## 💻 2. Client Setup (React / Vanilla JS)

Instead of using `await fetch()`, use the wrapper `fetchOptimized()`. It perfectly mirrors native `fetch` but intelligently decodes the compressed binary stream back into a standard parsed Javascript Object entirely in the background.

```javascript
import { fetchOptimized } from "api-payload-optimizer/client";

async function loadData() {
  try {
    // Drop-in replacement for standard native fetch()
    const { data, compression } = await fetchOptimized(
      "https://api.yourdomain.com/users",
    );

    // 'data' is your entirely uncompressed Javascript Object!
    console.log("Users:", data);

    // See exactly how much bandwidth you saved on this request
    console.log("Original Size:", compression.originalBytes);
    console.log("New Network Size:", compression.compressedBytes);
  } catch (error) {
    console.error("Failed to load:", error);
  }
}
```

---

## ⚙️ Advanced: Configuration

The algorithm automatically toggles compression levels depending on the specific payload size to maximize latency:

- `< 5 KB`: Sent as plain standard JSON.
- `5–50 KB`: Encoded into dense binary.
- `> 50 KB`: Encoded into dense binary + structurally compressed for the lowest possible network footprint.

The optimizer completely protects long-running node servers by structurally capping dictionary pooling shapes strictly at `8000` memory instances, ensuring no memory leaks occur when feeding massive uniquely generated datasets over months of uptime.

---

### License

MIT License - Copyright (c) 2026 K S Likith
