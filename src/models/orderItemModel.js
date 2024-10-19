import { DataTypes } from "sequelize";

export const createOrderItemModel = async (sequelize) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
  });

  // Relationships
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };
  return OrderItem;
};
