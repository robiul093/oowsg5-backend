import { AppError } from "../../utils/app_error";
import catchAsync from "../../utils/catch_async";
import { sendResponse } from "../../utils/send_response";
import { event_service } from "./event.service";

const create_event = catchAsync(async (req, res) => {
  const payload = req.body;

  if (!payload) {
    throw new AppError(404, "Payload data messing!!");
  }

  const result = await event_service.create_event_into_db(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Event created successfully.",
    data: result,
  });
});

const get_all_events = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(404, "User id not found");
  }

  const result = await event_service.get_all_event_from_db(userId!);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All events retrieve successfully.",
    data: result,
  });
});

const get_single_event = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user?.userId;
  console.log(eventId, userId);
  if (!userId || !eventId) {
    throw new AppError(404, "eventId or userId is messing");
  }

  const result = await event_service.get_single_event_from_db(userId!, eventId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event retrieved successfully.",
    data: result,
  });
});

export const event_controller = {
  create_event,
  get_all_events,
  get_single_event,
};
