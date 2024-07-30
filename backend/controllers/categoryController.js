import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {load} from '@cashfreepayments/cashfree-js';

const cashfree = await load({
	mode: "sandbox" 
  
});

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndRemove(req.params.categoryId);
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

// New function to create a Cashfree order for category-related payments
const createCashfreeOrderForCategory = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body; // Expect orderId and amount from request body

  if (!orderId || !amount) {
    res.status(400).json({ error: "Order ID and amount are required." });
    return;
  }

  try {
    const cashfreeOrder = await cashfree.createOrder({
      orderId,
      orderAmount: amount,
      customerName: req.user.username,
      customerEmail: req.user.email,
      customerPhone: req.user.phone, // Ensure user has phone in the model
    });

    res.json(cashfreeOrder);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Cashfree order creation failed");
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
  createCashfreeOrderForCategory, // Export the new Cashfree function
};
