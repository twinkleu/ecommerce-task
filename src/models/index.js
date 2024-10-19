import { sequelize } from "../config/db.js";
import { createUserModel } from "./userModel.js";
import { createProductModel } from "./productModel.js";
import { createOrderModel } from "./orderModel.js";
import { createOrderItemModel } from "./orderItemModel.js";
import { createCartModel } from "./cartModel.js";
import { createCartItemModel } from "./cartItemModel.js";
import { createTokenModel } from "./token.js";

let userModel = null;
let productModel = null;
let orderModel = null;
let orderItemModel = null;
let cartModel = null;
let cartItemModel = null;
let tokenModel = null;

const initializeModels = async () => {
  try {
    userModel = await createUserModel(sequelize);
    productModel = await createProductModel(sequelize);
    orderModel = await createOrderModel(sequelize);
    orderItemModel = await createOrderItemModel(sequelize);
    cartModel = await createCartModel(sequelize);
    cartItemModel = await createCartItemModel(sequelize);
    tokenModel = await createTokenModel(sequelize);

    userModel.associate &&
      userModel.associate({
        User: userModel,
        Cart: cartModel,
        CartItem: cartItemModel,
        Product: productModel,
        Order: orderModel,
        OrderItem: orderItemModel,
        Token: tokenModel,
      });
    productModel.associate &&
      productModel.associate({
        Product: productModel,
        CartItem: cartItemModel,
        Cart: cartModel,
        Order: orderModel,
        OrderItem: orderItemModel,
      });
    orderModel.associate &&
      orderModel.associate({
        Order: orderModel,
        Product: productModel,
        OrderItem: orderItemModel,
        User: userModel,
      });
    orderItemModel.associate &&
      orderItemModel.associate({ Order: orderModel, Product: productModel });
    cartModel.associate &&
      cartModel.associate({
        Cart: cartModel,
        CartItem: cartItemModel,
        Product: productModel,
        User: userModel,
      });
    cartItemModel.associate &&
      cartItemModel.associate({ Cart: cartModel, Product: productModel });

    await sequelize.sync();
    console.log("All models synced successfully.");
  } catch (error) {
    console.error("Error initializing models: ", error);
  }
};

export {
  userModel,
  productModel,
  orderModel,
  orderItemModel,
  cartModel,
  cartItemModel,
  tokenModel,
  initializeModels,
};
