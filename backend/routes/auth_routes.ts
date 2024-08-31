import express from "express";
import {
    login,
    register,
    // respondToMFAChallenge,
    
} from "../controllers/auth_controller";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.post("/mfa", respondToMFAChallenge);

export default authRouter;
