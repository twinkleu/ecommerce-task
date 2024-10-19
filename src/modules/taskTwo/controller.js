import {
  orderModel,
  orderItemModel,
  productModel,
} from "../../models/index.js";
import { Op, Sequelize } from "sequelize";
import { format, startOfWeek, endOfWeek } from "date-fns";

export const getUserProductOrderSummary = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const orders = await orderModel.findAll({
      where: { userId },
      include: [
        {
          model: orderItemModel,
          as: "orderItems",
          where: { productId },
          include: [{ model: productModel, as: "product" }],
        },
      ],
    });
    // console.log("ordersss", orders);
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for the specified user and product.",
      });
    }
    let totalQuantity = 0;
    let totalValue = 0;

    orders.forEach((order) => {
      if (order.orderItems) {
        order.orderItems.forEach((item) => {
          console.log("orderItemssss", item);
          totalQuantity += item.quantity;
          totalValue += item.price;
        });
      } else {
        console.log("orderItemssss undefined");
      }
    });
    res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length,
        totalQuantity,
        totalValue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export const getWeeklyOrdersAnalysis = async (req, res) => {
  try {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-03-31");

    const orders = await orderModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        status: "completed",
      },
      include: [
        {
          model: orderItemModel,
          as: "orderItems",
          include: [
            {
              model: productModel,
              as: "product",
            },
          ],
        },
      ],
    });

    const weeklySummary = {};

    orders.forEach((order) => {
      const weekStart = startOfWeek(new Date(order.createdAt), {
        weekStartsOn: 1,
      });
      const weekEnd = endOfWeek(new Date(order.createdAt), { weekStartsOn: 1 });

      const weekKey = `${format(weekStart, "MMMM d, yyyy")} - ${format(
        weekEnd,
        "MMMM d, yyyy"
      )}`;

      if (!weeklySummary[weekKey]) {
        weeklySummary[weekKey] = {
          totalOrders: 0,
          totalValue: 0,
          totalQuantity: 0,
        };
      }

      weeklySummary[weekKey].totalOrders += 1;
      weeklySummary[weekKey].totalValue += order.totalAmount;

      order.orderItems.forEach((orderItem) => {
        weeklySummary[weekKey].totalQuantity += orderItem.quantity;
      });
    });

    res.status(200).json({
      success: true,
      data: weeklySummary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export const getProductOrderCounts = async (req, res) => {
  try {
    const productsWithOrderCounts = await productModel.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.fn("COUNT", Sequelize.col("orderItems.orderId")),
          "orderCount",
        ],
      ],
      include: [
        {
          model: orderItemModel,
          as: "orderItems",
          attributes: [],
        },
      ],
      group: ["Product.id", "Product.name"],
      having: Sequelize.where(
        Sequelize.fn("COUNT", Sequelize.col("orderItems.orderId")),
        {
          [Op.gte]: 5,
        }
      ),
    });
    // console.log("dataaaaaaaaaaa", productsWithOrderCounts);
    const responseData = productsWithOrderCounts.map((product) => ({
      productId: product.id,
      productName: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      orderCount: product.dataValues.orderCount,
    }));
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

export const getProductsBySales = async (req, res) => {
  try {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-03-31");

    const productsWithSales = await productModel.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "price",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("orderItems.quantity")),
            0
          ),
          "totalQuantitySold",
        ],
      ],
      include: [
        {
          model: orderItemModel,
          as: "orderItems",
          attributes: [],
          required: false,
          include: [
            {
              model: orderModel,
              as: "order",
              attributes: [],
              where: {
                createdAt: {
                  [Op.between]: [startDate, endDate],
                },
                status: "completed",
              },
              required: false,
            },
          ],
        },
      ],
      group: ["Product.id"],
      having: Sequelize.or(
        Sequelize.where(
          Sequelize.fn("SUM", Sequelize.col("orderItems.quantity")),
          {
            [Op.gt]: 7, // Include products sold more than 7 times
          }
        ),
        Sequelize.where(
          Sequelize.fn("SUM", Sequelize.col("orderItems.quantity")),
          {
            [Op.is]: null, // Include products with no sales
          }
        )
      ),
    });

    // console.log("productsssssssss", productsWithSales);
    const responseData = productsWithSales.map((product) => ({
      productId: product.id,
      productName: product.name,
      description: product.description,
      price: product.price,
      totalQuantitySold: product.dataValues.totalQuantitySold,
    }));

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};
