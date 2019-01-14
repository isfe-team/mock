module.exports = {
  "/hello": {
    get: {
      description: "Returns 'Hello' to the caller",
      parameters: [
        {
          name: "name",
          in: "query",
          description: "The name of the person to whom to say hello",
          required: false,
          type: "string"
        }
      ],
      responses: {
        200: {
          description: "Success",
          schema: {
            $ref: "#/definitions/HelloWorldResponse"
          }
        },
        default: {
          description: "Error",
          schema: {
            $ref: "#/definitions/ErrorResponse"
          }
        }
      }
    }
  }
}
