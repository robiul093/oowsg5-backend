import { AppError } from "../../utils/app_error";
import { Event_Model } from "./event.schema";

const create_event_into_db = async (payload: any) => {
  const createdEvent = await Event_Model.create(payload);

  if (!createdEvent) {
    throw new AppError(500, "Failed to create event into db");
  }

  return createdEvent;
};

const get_all_event_from_db = async (userId: string) => {
  const events = await Event_Model.find({ userId });

  if (!events) {
    throw new AppError(404, "Events not fount");
  }

  return events;
};

const get_single_event_from_db = async (userId: string, eventId: string) => {
  const event = await Event_Model.findOne({ _id: eventId });

  if (!event) {
    throw new AppError(404, "This event not found");
  }
  return event;
};

export const event_service = {
  create_event_into_db,
  get_all_event_from_db,
  get_single_event_from_db,
};
