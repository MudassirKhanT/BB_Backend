import express from "express";
import { getJobs, getJobsStatus } from "../controllers/jobs.controller.ts";

const router = express.Router();

router.get("/",       getJobs);
router.get("/status", getJobsStatus);

export default router;
