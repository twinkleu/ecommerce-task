import { DataTypes } from "sequelize";

export const createTokenModel = async (sequelize) => {
  const Token = sequelize.define("Token", {
    tokenable_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenable_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Token.associate = (models) => {
    Token.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
    Token.belongsTo(models.User, { foreignKey: "updatedBy", as: "updater" });
    Token.belongsTo(models.User, { foreignKey: "deletedBy", as: "deleter" });
  };

  return Token;
};
