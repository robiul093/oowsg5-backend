import { Router } from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import { profileRoute } from "./app/modules/profile/profile.route";
import { eventRouter } from "./app/modules/event/event.route";
import { NotificationRoute } from "./app/modules/notification/notification.route";

const appRouter = Router();

const moduleRoutes = [
  { path: "/auth", route: authRouter },
  { path: "/profile", route: profileRoute },
  { path: "/event", route: eventRouter },
  { path: "/notification", route: NotificationRoute },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));

export default appRouter;
