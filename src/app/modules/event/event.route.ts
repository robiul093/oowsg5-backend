import { Router } from "express";
import { event_controller } from "./event.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", event_controller.create_event);
router.get("/all-event", auth(), event_controller.get_all_events);
router.get("/single-event/:id", auth(), event_controller.get_single_event);

export const eventRouter = router;
