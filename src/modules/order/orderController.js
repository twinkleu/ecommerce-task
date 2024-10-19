import {
  cartModel,
  cartItemModel,
  orderModel,
  orderItemModel,
  productModel,
} from "../../models/index.js";
import { sequelize } from "../../config/db.js";

export const placeOrder = async (req, res) => {
  const userId = req.id;
  // console.log("huuuuuuuuu");
  const transaction = await sequelize.transaction();

  try {
    const cart = await cartModel.findOne({
      where: { userId },
      include: {
        model: cartItemModel,
        as: "cartItems",
        include: [productModel],
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    let totalAmount = 0;
    cart.cartItems.forEach((item) => {
      totalAmount += item.quantity * item?.Product?.price;
    });
    const order = await orderModel.create(
      {
        userId,
        totalAmount,
        status: "pending",
      },
      { transaction }
    );

    const orderItemsData = cart.cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.quantity * item.Product.price,
    }));

    await orderItemModel.bulkCreate(orderItemsData, { transaction });

    await cartItemModel.destroy({ where: { cartId: cart.id }, transaction });
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save({ transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully, pending payment:You have to do checkout for the payment or the successful order completion",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error,
    });
  }
};

export const checkout = async (req, res) => {
  const userId = req.id;
  const { orderId } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const order = await orderModel.findOne({
      where: { id: orderId, userId, status: "pending" },
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "No pending order found for checkout.",
      });
    }

    const paymentSuccess = true; // Assume payment is successful for now
    if (!paymentSuccess) {
      return res.status(400).json({
        success: false,
        message: "Payment failed.",
      });
    }

    // Updating order status to 'completed' once payment is successful
    order.status = "completed";
    await order.save({ transaction });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Order payment successful, order completed",
      order,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: "Checkout failed",
      error,
    });
  }
};

export const getOrders = async (req, res) => {
  const userId = req.id;

  try {
    const orders = await orderModel.findAll({
      where: { userId },
      include: {
        model: orderItemModel,
        as: "orderItems",
        include: [productModel],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for the user.",
      });
    }

    const formattedOrders = orders.map((order) => {
      const items = order.orderItems.map((item) => ({
        productId: item.productId,
        productName: item?.Product?.name,
        quantity: item.quantity,
        price: item.price,
      }));

      return {
        orderId: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        items,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error,
    });
  }
};
