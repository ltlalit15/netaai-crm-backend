import express, { Router } from "express";
import AuthRouter from "./Routers/AuthRouter.js";
import PurchesOrderRouter from "./Routers/PurchesOrderRouter.js";
import ClientRouter from "./Routers/ClientRouter.js";
import VendorRouter from "./Routers/VendorRouter.js";
import CatlogItemRouter from "./Routers/CatlogItemRouter.js";
import ProjectRouter from "./Routers/ProjectRouter.js";
import TaskRouter from "./Routers/TaskRouter.js";
import DepartmentRouter from "./Routers/DepartmentRouter.js";
import ContractJobRouter from "./Routers/ContractJobRouter.js";
import ProductRouter from "./Routers/ProductRouter.js";
import ServiceRouter from "./Routers/ServiceRouter.js";
import InvoiceRouter from "./Routers/InvoiceRouter.js";
import BillRouter from "./Routers/BillRouter.js";
import RoleRouter from "./Routers/RoleRouter.js";

const router = Router();

router.use("/api", AuthRouter);
router.use("/api", PurchesOrderRouter);
router.use("/api", ClientRouter);
router.use("/api", VendorRouter);
router.use("/api", CatlogItemRouter);
router.use("/api", ProjectRouter);
router.use("/api", TaskRouter);
router.use("/api", DepartmentRouter);
router.use("/api", ContractJobRouter);
router.use("/api", ServiceRouter);
router.use("/api", ProductRouter);
router.use("/api", InvoiceRouter);
router.use("/api", BillRouter);
router.use("/api", RoleRouter);

export default router;
