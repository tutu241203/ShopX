import express from "express";
import cors from "cors";
import Product from "../models/product.model.js";

const router = express.Router();

router.use(cors({
  origin: "https://shopx-mf2i.onrender.com",
  methods: "GET, POST",
  allowedHeaders: "Content-Type",
}));


router.post("/", async (req, res) => {
  const { message } = req.body;
  let response = "I didn't understand that.";

  try {
    if (message.toLowerCase().includes("hello")) {
      response = "Hello! How can I assist you today?";
    } else if (message.toLowerCase().includes("store hours")) {
      response = `Our store hours are: Monday-Friday: 9:00 AM - 9:00 PM, Saturday-Sunday: 10:00 AM - 8:00 PM.`;
    } else if (message.toLowerCase().includes("recommend")) {
      const products = await Product.aggregate([{ $sample: { size: 3 } }]); 

      if (products.length > 0) {
        response = products.map((product) => ({
          name: product.name,
          price: product.price,
          description: product.description,
        }));
      } else {
        response = "No products available at the moment.";
      }
    }

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "There was an error processing your request." });
  }
});

export default router;
