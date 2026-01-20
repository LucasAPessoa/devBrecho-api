import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/tokenHelper";

export async function AuthHook(req: FastifyRequest, rep: FastifyReply) {
    const { authorization } = req.headers;

    if (!authorization) {
        return rep.status(401).send({ message: "Token não fornecido" });
    }

    const [, token] = authorization.split(" ");

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return rep.status(401).send({ message: "Token inválido" });
        }

        req.user = { userId: (decoded as { userId: string }).userId };
    } catch (error) {
        return rep.status(401).send({ message: "Token inválido" });
    }
}
