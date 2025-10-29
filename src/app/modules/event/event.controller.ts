import { AppError } from "../../utils/app_error";
import catchAsync from "../../utils/catch_async";
import { uploadToCloudinary } from "../../utils/cloudinaryUploader";
import { sendResponse } from "../../utils/send_response";
import { event_service } from "./event.service";
import * as fs from "fs";
import moment from "moment-timezone";

export const create_event = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const { time, alarm, timeZone } = req.body;

  if (!userId || !req.body) {
    throw new AppError(404, "UserId or payload not found!!");
  }
  console.log(req.file);
  // Optional file upload handling
  let fileUrl: string | null = null;
  let previewUrl: string | null = null;

  if (req.file) {
  const filePath = req.file.path;
  
  // Always upload as "image" for public delivery + viewer
  const uploadResult = await uploadToCloudinary(filePath, "image");

  fileUrl = uploadResult.url; // original PDF (downloadable)

  // Generate viewer URL
  previewUrl = uploadResult.url.replace(
    '/upload/',
    '/upload/fl_viewer/'
  );

  // Clean up
  fs.unlink(filePath, () => {});
}

  // Convert local time to UTC
  const utcTime = moment.tz(time, timeZone).utc().toDate();
  const utcAlarm = moment.tz(alarm, timeZone).utc().toDate();

  const payload = {
    userId,
    ...req.body,
    time: utcTime,
    alarm: utcAlarm,
    fileUrl,
    previewUrl, // <-- this is your working PDF preview
  };
  
  const result = await event_service.create_event_into_db(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Event created successfully.",
    data: result,
  });
});

export const get_all_events = catchAsync(async (req, res) => {
  const userId = req.user?.userId;

  const searchTerm = typeof req.query.searchTerm === "string" ? req.query.searchTerm : undefined;
  const timeFilter =
    typeof req.query.timeFilter === "string"
      ? (req.query.timeFilter as "day" | "week" | "month")
      : undefined;
  const referenceDate = typeof req.query.date === "string" ? req.query.date : undefined;

  if (!userId) throw new AppError(404, "User id not found");

  const result = await event_service.get_all_event_from_db(
    userId,
    searchTerm,
    timeFilter,
    referenceDate
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Events retrieved successfully",
    data: result,
  });
});

const get_single_event = catchAsync(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user?.userId;
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

const update_event = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const eventId = req.params.id;
  let { time, alarm, timeZone, status } = req.body;

  if (!userId || !eventId) {
    throw new AppError(404, "userId or eventId not found");
  }

  // Convert local to UTC if user sends new times
  if (time && timeZone) {
    time = moment.tz(time, timeZone).utc().toDate();
  }
  if (alarm && timeZone) {
    alarm = moment.tz(alarm, timeZone).utc().toDate();
  }

  if (!status) {
    status = "upcoming";
  }

  const payload = { ...req.body, status, time, alarm };

  const result = await event_service.update_event_into_db(userId, eventId, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Event updated successfully.",
    data: result,
  });
});

const delete_event = catchAsync(async (req, res) => {
  const userId = req?.user?.userId;
  const eventId = req.params.id;

  if (!userId || !eventId) {
    throw new AppError(404, "UserId or EventId not found");
  }

  const result = await event_service.delete_event_from_db(userId, eventId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "event deleted successfully.",
    data: result,
  });
});

export const event_controller = {
  create_event,
  get_all_events,
  get_single_event,
  update_event,
  delete_event,
};
