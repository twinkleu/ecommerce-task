import { DataTypes } from "sequelize";

export const createCartModel = async (sequelize) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    totalItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
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

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId" });
    Cart.hasMany(models.CartItem, { foreignKey: "cartId", as: "cartItems" });
    Cart.belongsToMany(models.Product, {
      through: models.CartItem,
      foreignKey: "cartId",
    });
  };

  return Cart;
};
