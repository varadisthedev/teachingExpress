import express from "express";
import { cache, invalidateCache } from "../middleware/cache.js";
// import your DB model/query function here

const router = express.Router();

// ─── GET all products ────────────────────────────────────────────
// Cache key: 'products:all'
// TTL: 120 seconds (2 minutes)
// Second request within 2 minutes never touches the DB
router.get("/", cache("products:all", 120), async (req, res) => {
  try {
    // This only runs on a cache MISS
    const products = await db.query("SELECT * FROM products");
    res.json(products);
    // res.json is intercepted by the middleware — data is saved to Redis automatically
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ─── GET single product ───────────────────────────────────────────
// Dynamic cache key per product ID
router.get(
  "/:id",
  cache(`products:${req.params.id}`, 120),
  async (req, res) => {
    // ⚠️ NOTE: the pattern above doesn't work — req isn't available at route definition time
    // You need the middleware inline like this:
  },
);

// Correct way for dynamic keys — use a wrapper or inline middleware:
router.get(
  "/:id",
  async (req, res, next) => {
    const cacheKey = `products:${req.params.id}`;
    return cache(cacheKey, 120)(req, res, next);
  },
  async (req, res) => {
    try {
      const product = await db.query("SELECT * FROM products WHERE id = $1", [
        req.params.id,
      ]);
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  },
);

// ─── UPDATE product (must invalidate cache) ───────────────────────
router.put("/:id", async (req, res) => {
  try {
    const updated = await db.query(
      "UPDATE products SET name = $1 WHERE id = $2 RETURNING *",
      [req.body.name, req.params.id],
    );

    // Invalidate both the individual product cache and the all-products cache
    await invalidateCache(`products:${req.params.id}`);
    await invalidateCache("products:all");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ─── DELETE product ───────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = $1", [req.params.id]);

    await invalidateCache(`products:${req.params.id}`);
    await invalidateCache("products:all");
    console.log(`Deleted product ${req.params.id}, cache invalidated.`);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
