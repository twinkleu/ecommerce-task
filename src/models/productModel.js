import { DataTypes } from "sequelize";

export const createProductModel = async (sequelize) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  // Relationships
  Product.associate = (models) => {
    Product.belongsToMany(models.Cart, {
      through: models.CartItem,
      foreignKey: "productId",
    });
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: "productId",
    });
    Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  };

  return Product;
};
