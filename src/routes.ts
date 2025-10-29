import { Router } from "express";
import { profileRoute } from "./app/modules/profile/profile.route";
import { NotificationRoute } from "./app/modules/notification/notification.route";
import { planRoute } from "./app/modules/plan/plan.route";
import { authRoute } from "./app/modules/auth/auth.route";
import { eventRoute } from "./app/modules/event/event.route";

const appRouter = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoute },
  { path: "/profile", route: profileRoute },
  { path: "/event", route: eventRoute },
  { path: "/notification", route: NotificationRoute },
  { path: "/plan", route: planRoute },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));

export default appRouter;
