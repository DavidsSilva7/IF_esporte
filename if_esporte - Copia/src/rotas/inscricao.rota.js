import express from "express";

import { listarInscricoes, criarInscricao, atualizarInscricao,excluirInscricao} from "../controladores/inscricao.ctl.js";
import autenticar from "../middleware/autenticador.js"
import autorizar from "../middleware/autorizar.js"
const inscricao_rotas = express.Router();

inscricao_rotas.get("/", autenticar, listarInscricoes);
inscricao_rotas.post("/", autenticar, criarInscricao);
inscricao_rotas.patch("/:id", autenticar, autorizar("ADMIN","Organizador"), atualizarInscricao);
inscricao_rotas.delete("/:id", autenticar, excluirInscricao);

export default inscricao_rotas;