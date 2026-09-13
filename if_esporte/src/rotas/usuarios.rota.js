import express from "express";

import { listarUsuarios, criarUsuario, atualizarUsuario, excluirUsuario, alterarRole } from "../controladores/usuario.ctl.js";
import autenticar from "../middleware/autenticador.js"
import autorizar from "../middleware/autorizar.js"

const usuario_rotas = express.Router();

usuario_rotas.get("/",autenticar, autorizar("ADMIN"), listarUsuarios);
usuario_rotas.post("/",criarUsuario);
usuario_rotas.patch("/:id",autenticar, autorizar("ADMIN"), atualizarUsuario);
usuario_rotas.delete("/:id",autenticar, autorizar("ADMIN"), excluirUsuario);
usuario_rotas.patch("/:id/role", autenticar, autorizar("ADMIN"), alterarRole);

export default usuario_rotas;