import { DataTypes } from "sequelize";

export const createOrderModel = async (sequelize) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });

  // Relationships
  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "userId", as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "orderItems" });
    Order.belongsToMany(models.Product, {
      through: models.OrderItem,
      foreignKey: "orderId",
    });
  };
  return Order;
}; 
