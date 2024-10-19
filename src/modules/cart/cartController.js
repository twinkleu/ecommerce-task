import { cartModel, cartItemModel, productModel } from "../../models/index.js";

export const addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.id;

  try {
    const product = await productModel.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await cartModel.findOne({ where: { userId } });
    if (!cart) {
      cart = await cartModel.create({
        userId,
        totalItems: 0,
        totalPrice: 0.0,
      });
    }

    let cartItem = await cartItemModel.findOne({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await cartItemModel.create({
        cartId: cart.id,
        productId: product.id,
        quantity,
      });
    }

    cart.totalItems += quantity;
    cart.totalPrice += product.price * quantity;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error,
    });
  }
};
