import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export async function globalErrorHandler(
    error: FastifyError,
    req: FastifyRequest,
    rep: FastifyReply
) {
    console.error("Global Error Handler:", error);
    console.error("Request URL: ", req.url);
    console.error("Request Method: ", req.method);

    if (error.validation) {
        return rep.status(400).send({
            statusCode: 400,
            error: "Validation Error",
            message: "Validation failed: " + error.message,
            details: error.validation,
        });
    }

    if (error instanceof ZodError) {
        return rep.status(400).send({
            statusCode: 400,
            error: "Validation Error",
            message: "Validation failed",
            details: error.format(),
        });
    }

    if (error.statusCode) {
        return rep.status(error.statusCode).send({
            statusCode: error.statusCode,
            error: error.name || "Error",
            message: error.message,
        });
    }

    return rep.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Internal server error.",
    });
}
