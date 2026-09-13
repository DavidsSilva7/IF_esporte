import express from "express";

import { listarClassificacoes,criarClassificacao, atualizarClassificacao,excluirClassificacao} from "../controladores/classificacao.ctl.js";
import autenticar from "../middleware/autenticador.js";
import autorizar from "../middleware/autorizar.js";

const classificacao_rotas = express.Router();

classificacao_rotas.get("/", listarClassificacoes);
classificacao_rotas.post("/",autenticar,autorizar("ADMIN","ORGANIZADOR"), criarClassificacao);
classificacao_rotas.patch("/:id",autenticar,autorizar("ADMIN","ORGANIZADOR"), atualizarClassificacao);
classificacao_rotas.delete("/:id",autenticar,autorizar("ADMIN","ORGANIZADOR"), excluirClassificacao);

export default classificacao_rotas;