import jwt, { SignOptions } from "jsonwebtoken";

export function generateToken(userId: string): string {
    const payload = { userId };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT secret not defined");
    }

    const options: SignOptions = {
        expiresIn: "1d",
    };

    return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): string | jwt.JwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT secret not defined");
    }

    return jwt.verify(token, secret);
}
