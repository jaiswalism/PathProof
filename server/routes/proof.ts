import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { lat, lng, timestamp, deviceId } = req.body;

    // Validate input
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      typeof timestamp !== "number" ||
      typeof deviceId !== "number"
    ) {
      return res.status(400).json({ error: "Invalid input values" });
    }
  } catch (err) {
    console.error("Error generating proof:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
