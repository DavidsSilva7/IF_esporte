import express from "express";
import { listarEventos, criarEvento, atualizarEvento, excluirEvento } from "../controladores/evento.ctl.js";
import autenticar from "../middleware/autenticador.js";
import autorizar from "../middleware/autorizar.js";

const evento_rotas = express.Router();

evento_rotas.get("/", listarEventos);
evento_rotas.post("/", autenticar, autorizar("ADMIN", "ORGANIZADOR"), criarEvento);
evento_rotas.patch("/:id",autenticar, autorizar("ADMIN", "ORGANIZADOR"), atualizarEvento);
evento_rotas.delete("/:id",autenticar,autorizar("ADMIN","ORGANIZADOR"), excluirEvento);
export default evento_rotas;