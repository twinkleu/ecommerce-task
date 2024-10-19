import { productModel } from "../../models/index.js";

export const addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  try {
    if (!name || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and stock are required",
      });
    }
    const existingProduct = await productModel.findOne({
      where: { name },
    });

    if (existingProduct) {
      return res
        .status(409)
        .json({ success: false, message: "Product already exists" });
    }
    const product = await productModel.create({
      name,
      description,
      price,
      stock,
    });
    if (!product) {
      return res
        .status(500)
        .json({ success: false, message: "Error while creating the product" });
    }
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create product", error });
  }
};
