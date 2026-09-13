import express from "express";

import { listarPreparacoes, criarPreparacao, atualizarPreparacao, excluirPreparacao } from "../controladores/preparacao.ctl.js";
import autenticar from "../middleware/autenticador.js"
import autorizar from "../middleware/autorizar.js"

const preparacao_rotas = express.Router();

preparacao_rotas.get("/", listarPreparacoes);
preparacao_rotas.post("/",autenticar,autorizar("ADMIN"), criarPreparacao);
preparacao_rotas.patch("/:id",autenticar, autorizar("ADMIN"), atualizarPreparacao);
preparacao_rotas.delete("/:id",autenticar, autorizar("ADMIN"), excluirPreparacao);

export default preparacao_rotas;