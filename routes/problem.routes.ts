import express from "express";
import {
  getProblemsByCourse,
  getProblemOfTheDay,
  getProblemBySlug,
  getAllProblems,
  updateProblemStatus,
  getAllProblemsAdmin,
  createProblem,
  updateProblem,
  deleteProblem,
  submitProblem,
} from "../controllers/problem.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.ts";
import { authorize } from "../middlewares/role.middleware.ts";

const router = express.Router();

// Admin — must be before /:slug
router.get("/admin/all", protect, authorize("admin"), getAllProblemsAdmin);
router.post("/", protect, authorize("admin"), createProblem);
router.patch("/:id", protect, authorize("admin"), updateProblem);
router.delete("/:id", protect, authorize("admin"), deleteProblem);

// Public / user — must be before /:slug
router.get("/potd", optionalAuth, getProblemOfTheDay);
router.get("/all", optionalAuth, getAllProblems);
router.get("/course/:courseSlug", optionalAuth, getProblemsByCourse);
router.get("/:slug", optionalAuth, getProblemBySlug);
router.post("/:slug/submit", protect, submitProblem);
router.post("/:slug/status", protect, updateProblemStatus);

export default router;
