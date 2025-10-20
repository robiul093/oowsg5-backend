import { AppError } from "../../utils/app_error";
import { TEvent } from "./event.interface";
import { Event_Model } from "./event.schema";

const create_event_into_db = async (payload: any) => {
  const createdEvent = await Event_Model.create(payload);
  console.log(createdEvent);
  if (!createdEvent) {
    throw new AppError(500, "Failed to create event into db");
  }

  return createdEvent;
};

const get_all_event_from_db = async (
  userId: string,
  searchTerm?: string,
  timeFilter?: "day" | "week" | "month",
  referenceDate?: string // optional, e.g., "2025-10-16"
) => {
  const query: any = { userId, isDeleted: false };

  // Search filter
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Time filter
  if (timeFilter) {
    const ref = referenceDate ? new Date(referenceDate) : new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeFilter) {
      case "day":
        startDate = new Date(
          Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate(), 0, 0, 0)
        );
        endDate = new Date(
          Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate(), 23, 59, 59, 999)
        );
        break;

      case "week":
        const dayOfWeek = ref.getUTCDay(); // 0 = Sunday
        startDate = new Date(ref);
        startDate.setUTCDate(ref.getUTCDate() - dayOfWeek);
        startDate.setUTCHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 6);
        endDate.setUTCHours(23, 59, 59, 999);
        break;

      case "month":
        startDate = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1, 0, 0, 0));
        endDate = new Date(
          Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() + 1, 0, 23, 59, 59, 999)
        );
        break;

      default:
        startDate = new Date(0);
        endDate = new Date();
    }

    query.time = { $gte: startDate, $lte: endDate };
  }

  const events = await Event_Model.find(query).sort({ time: 1 });

  if (!events || events.length <= 0) {
    throw new AppError(404, "No event found");
  }

  return events;
};

const get_single_event_from_db = async (userId: string, eventId: string) => {
  const event = await Event_Model.findOne({ userId, _id: eventId, isDeleted: false });

  if (!event) {
    throw new AppError(404, "Event not found or already deleted");
  }
  return event;
};

const update_event_into_db = async (userId: string, eventId: string, payload: Partial<TEvent>) => {
  const event = await Event_Model.findOneAndUpdate(
    { userId, _id: eventId, isDeleted: false },
    payload,
    {
      new: true,
    }
  );

  if (!event) {
    throw new AppError(500, "Failed to update event");
  }

  return event;
};

const delete_event_from_db = async (userId: string, eventId: string) => {
  const deletedEvent = await Event_Model.findOneAndUpdate(
    { userId, _id: eventId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!deletedEvent) {
    throw new AppError(404, "Event not found or already deleted");
  }

  return {
    message: "Event deleted successfully",
    event: deletedEvent,
  };
};

export const event_service = {
  create_event_into_db,
  get_all_event_from_db,
  get_single_event_from_db,
  update_event_into_db,
  delete_event_from_db,
};
