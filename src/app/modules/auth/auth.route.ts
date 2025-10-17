import { Router } from "express";
import { auth_controller } from "./auth.controller";
import RequestValidator from "../../middlewares/request_validator";
import { change_password_schema, login_schema } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/register", auth_controller.sign_up_user);
router.post("/resend-otp", auth_controller.resend_otp);
router.post("/verify-email", auth_controller.verify_email);
router.post("/login", RequestValidator(login_schema), auth_controller.login_user);
router.patch(
  "/change-password",
  auth(),
  RequestValidator(change_password_schema),
  auth_controller.change_password
);

router.post("/forgot-password", auth_controller.forgot_password);
router.post("/reset-password", auth_controller.reset_password);
router.post("/login-with-google", auth_controller.login_user_with_google);
router.patch("/fcm-token", auth(), auth_controller.set_fcm_token);

export const authRouter = router;
