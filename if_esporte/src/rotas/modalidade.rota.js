import express from "express";

import {listarModalidades, criarModalidade, atualizarModalidade, excluirModalidade } from "../controladores/modalidade.ctl.js";
import autenticar from "../middleware/autenticador.js";
import autorizar from "../middleware/autorizar.js";

const modalidade_rotas = express.Router();

modalidade_rotas.get("/", listarModalidades);
modalidade_rotas.post("/",autenticar, autorizar("ADMIN","ORGANIZADOR"), criarModalidade);
modalidade_rotas.patch("/:id", autenticar, autorizar("ADMIN","ORGANIZADOR"), atualizarModalidade);
modalidade_rotas.delete("/:id", autenticar, autorizar("ADMIN","ORGANIZADOR"), excluirModalidade);
export default modalidade_rotas;