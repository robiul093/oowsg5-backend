export const eventDocs = {
  "api/v1/event": {
    post: {
      tags: ["Events"],
      summary: "Create a new event",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "time"],
              properties: {
                title: { type: "string", example: "Mark's Birthday" },
                description: { 
                  type: "string", 
                  example: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." 
                },
                time: { type: "string", format: "date-time", example: "2025-10-18T10:00:00.000Z" },
                alarm: { type: "string", format: "date-time", example: "2025-10-17T09:45:00.000Z" },
                color: { type: "string", example: "#3B82F6" }
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Event created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Event created successfully" },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "68ef461ab688392d1bb15c73" },
                      title: { type: "string", example: "Mark's Birthday" },
                      description: { type: "string" },
                      time: { type: "string", format: "date-time" },
                      alarm: { type: "string", format: "date-time" },
                      color: { type: "string", example: "#3B82F6" },
                      status: { type: "string", example: "upcoming" }
                    }
                  }
                },
              },
            },
          },
        },
        400: { description: "Invalid input data" },
        401: { description: "Unauthorized - Invalid or missing token" },
      },
    },
  },

  "api/v1/event/get-single-event/{id}": {
    get: {
      tags: ["Events"],
      summary: "Get a single event by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            example: "68ef461ab688392d1bb15c73"
          },
          description: "Event ID"
        }
      ],
      responses: {
        200: {
          description: "Event retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Event retrieved successfully" },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "68ef461ab688392d1bb15c73" },
                      title: { type: "string", example: "Mark's Birthday" },
                      description: { type: "string" },
                      time: { type: "string", format: "date-time" },
                      alarm: { type: "string", format: "date-time" },
                      color: { type: "string", example: "#3B82F6" },
                      status: { type: "string", example: "upcoming" }
                    }
                  }
                },
              },
            },
          },
        },
        404: { description: "Event not found" },
        401: { description: "Unauthorized - Invalid or missing token" },
      },
    },
  },

  "api/v1/event/get-all-event": {
    get: {
      tags: ["Events"],
      summary: "Get all events with optional filtering",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "Project Meeting"
          },
          description: "Search term for event titles/descriptions"
        },
        {
          name: "timeFilter",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["day", "week", "month"],
            example: "day"
          },
          description: "Filter events by time range"
        },
        {
          name: "date",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date",
            example: "2025-10-18"
          },
          description: "Reference date for filtering"
        }
      ],
      responses: {
        200: {
          description: "Events retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Events retrieved successfully" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "68ef461ab688392d1bb15c73" },
                        title: { type: "string", example: "Mark's Birthday" },
                        description: { type: "string" },
                        time: { type: "string", format: "date-time" },
                        alarm: { type: "string", format: "date-time" },
                        color: { type: "string", example: "#3B82F6" },
                        status: { type: "string", example: "upcoming" }
                      }
                    }
                  }
                },
              },
            },
          },
        },
        401: { description: "Unauthorized - Invalid or missing token" },
      },
    },
  },

  "api/v1/event/update-event/{id}": {
    patch: {
      tags: ["Events"],
      summary: "Update an existing event",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            example: "68ef461ab688392d1bb15c73"
          },
          description: "Event ID"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Sprint Planning" },
                description: { type: "string", example: "Plan tasks for the next sprint" },
                time: { type: "string", format: "date-time", example: "2025-10-18T10:00:00.000Z" },
                alarm: { type: "string", format: "date-time", example: "2025-10-17T09:45:00.000Z" },
                color: { type: "string", example: "red" },
                status: { 
                  type: "string", 
                  enum: ["upcoming", "complete", "missed"],
                  example: "upcoming"
                }
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Event updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Event updated successfully" },
                  data: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "68ef461ab688392d1bb15c73" },
                      title: { type: "string", example: "Sprint Planning" },
                      description: { type: "string" },
                      time: { type: "string", format: "date-time" },
                      alarm: { type: "string", format: "date-time" },
                      color: { type: "string", example: "red" },
                      status: { type: "string", example: "upcoming" }
                    }
                  }
                },
              },
            },
          },
        },
        404: { description: "Event not found" },
        400: { description: "Invalid input data" },
        401: { description: "Unauthorized - Invalid or missing token" },
      },
    },
  },

  "api/v1/event/delete-event/{id}": {
    patch: {
      tags: ["Events"],
      summary: "Delete an event (soft delete)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            example: "68ef461ab688392d1bb15c73"
          },
          description: "Event ID"
        }
      ],
      responses: {
        200: {
          description: "Event deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Event deleted successfully" }
                },
              },
            },
          },
        },
        404: { description: "Event not found" },
        401: { description: "Unauthorized - Invalid or missing token" },
      },
    },
  },
};