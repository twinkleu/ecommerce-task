import { DataTypes } from "sequelize";

export const createUserModel = async (sequelize) => {
  const User = sequelize.define("User", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Cart, { foreignKey: "userId" });
    User.hasMany(models.Order, { foreignKey: "userId", as:"orders"});
  };

  return User;
};
