import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export async function globalErrorHandler(
    error: FastifyError,
    req: FastifyRequest,
    rep: FastifyReply,
) {
    console.error("Global Error Handler:", error);
    console.error("Request URL: ", req.url);
    console.error("Request Method: ", req.method);

    if (error.validation) {
        return rep.status(400).send({
            statusCode: 400,
            message: "Validation failed: " + error.message,
            details: error.validation,
        });
    }

    if (error instanceof ZodError) {
        return rep.status(400).send({
            statusCode: 400,
            message: "Validation failed",
            details: error.format(),
        });
    }

    if (error.statusCode === 401) {
        return rep.status(401).send({
            statusCode: 401,
            message: "Unauthorized",
            details: error.message,
        });
    }

    if (error.statusCode) {
        return rep.status(error.statusCode).send({
            statusCode: error.statusCode,
            message: error.message,
            details: error.validation,
        });
    }

    return rep.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        details: error.message,
    });
}
