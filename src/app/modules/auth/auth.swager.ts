export const authDocs = {
  "/api/v1/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "user@example.com" },
                password: { type: "string", example: "secret123" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
        },
        400: {
          description: "Invalid input or user already exists",
        },
      },
    },
  },

  "/api/v1/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "abcd@gmail.com" },
                password: { type: "string", example: "123456" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  token: { type: "string", example: "JWT_TOKEN_HERE" },
                },
              },
            },
          },
        },
        401: { description: "Invalid credentials" },
      },
    },
  },

  "/api/v1/auth/verify-email": {
    post: {
      tags: ["Auth"],
      summary: "Verify user email with OTP",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "otp"],
              properties: {
                email: { type: "string", example: "user@example.com" },
                otp: { type: "string", example: "123456" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Email verified successfully" },
        400: { description: "Invalid OTP or email" },
      },
    },
  },

  "/api/v1/auth/resend-otp": {
    post: {
      tags: ["Auth"],
      summary: "Resend verification OTP",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", example: "user@example.com" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "OTP resent successfully" },
      },
    },
  },

  "/api/v1/auth/change-password": {
    patch: {
      tags: ["Auth"],
      summary: "Change password (requires authentication)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["oldPassword", "newPassword"],
              properties: {
                oldPassword: { type: "string", example: "123456" },
                newPassword: { type: "string", example: "newPassword123" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Password updated successfully" },
        401: { description: "Unauthorized or invalid token" },
      },
    },
  },

  // "api/v1/auth/"
};
