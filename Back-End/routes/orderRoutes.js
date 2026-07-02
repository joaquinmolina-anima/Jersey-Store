const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);

router.get("/", orderController.getOrders);

router.get("/usuario/:usuario_id", orderController.getOrdersByUser);

router.get("/:id/detalles", orderController.getOrderDetails);

router.put("/:id", orderController.updateOrderStatus);

module.exports = router;
