import express, { Router } from "express";
import AuthRouter from "./Routers/AuthRouter.js";
import ProposalRouter from "./Routers/ProposalRouter.js";
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
import NotesRouter from "./Routers/NotesRouter.js";
import DailyLogRouter from "./Routers/DailyLogRouter.js";
import commentsRouter from "./Routers/commentsRouter.js";
import taxesRouter from "./Routers/taxesRouter.js";
import subtaskRouter from "./Routers/subtaskRouter.js";
import contractRouter from "./Routers/contractRouter.js";
import JobPlanningRouter from "./Routers/JobPlanningRouter.js";
import DocumentRouter from "./Routers/DocumentRouter.js";
import StatusRouter from "./Routers/StatusRouter.js";
import DocumentRecordRouter from "./Routers/DocumentRecordRouter.js"
import SendEmailRouter from "./Routers/SendEmailRouter.js"
import SendProposalRouter from "./Routers/SendProposalRouter.js"
import LogEnvelopeRouter from "./Routers/LogEnvelopeRouter.js"
import RecentActivityRouter from "./Routers/RecentActivityRouter.js"
const router = Router();

router.use("/api", AuthRouter);
router.use("/api", ProposalRouter);
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
router.use("/api", NotesRouter);
router.use("/api", DailyLogRouter);
router.use("/api", commentsRouter);
router.use("/api", taxesRouter);
router.use("/api", subtaskRouter);
router.use("/api", contractRouter);
router.use("/api", JobPlanningRouter);
router.use("/api", DocumentRouter);
router.use("/api", StatusRouter);
router.use("/api", DocumentRecordRouter);
router.use("/api", SendEmailRouter);
router.use("/api", SendProposalRouter);
router.use("/api", LogEnvelopeRouter);
router.use("/api", RecentActivityRouter


export default router;

