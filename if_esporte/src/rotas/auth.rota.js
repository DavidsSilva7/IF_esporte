import express from "express";

import { login } from "../controladores/auth.ctl.js";

const auth_rotas = express.Router();
auth_rotas.post("/login", login);

export default auth_rotas;