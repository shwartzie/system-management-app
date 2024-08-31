import crypto from "crypto";
import jwt from "jsonwebtoken";
require("dotenv").config();
// Create random number.
export const random = () => {
    return crypto.randomBytes(128).toString("base64");
};
// Authentication password for encryption.
export const authentication = (salt: string, password: string) => {
    return crypto
        .createHmac("sha256", [salt, password].join("/"))
        .update(process.env.SECRET)
        .digest("hex");
};
// Verify Token.
export const JWTverify = (sessionToken: string) => {
    return jwt.verify(sessionToken, process.env.SECRET);
};
// Create Token.
export const JWTsign = (username: string, salt: string) => {
    return jwt.sign(
        { _username: username?.toString(), salt: salt },
        process.env.SECRET,
        {
            expiresIn: "1 h",
        }
    );
};
