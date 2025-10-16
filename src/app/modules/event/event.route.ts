import { Router } from "express";
import { event_controller } from "./event.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/", auth(), event_controller.create_event);
router.get("/get-all-event", auth(), event_controller.get_all_events);
router.get("/get-single-event/:id", auth(), event_controller.get_single_event);
router.patch("/update-event/:id", auth(), event_controller.update_event);
router.patch("/delete-event/:id", auth(), event_controller.delete_event);

export const eventRouter = router;
