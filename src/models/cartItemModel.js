import { DataTypes } from "sequelize";

export const createCartItemModel = async (sequelize) => {
  const CartItem = sequelize.define("CartItem", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Carts",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
  });

  // Relationships
  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId" });
    CartItem.belongsTo(models.Product, { foreignKey: "productId" });
  };

  return CartItem;
};
