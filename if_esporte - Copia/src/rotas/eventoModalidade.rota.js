import express from "express";
import { ltMdlEvento, adcMdlEvento, rmvMdlEvento } from "../controladores/eventoModalidade.ctl.js";

const evento_modalidade_rotas = express.Router();

evento_modalidade_rotas.get("/:eventoId/modalidades", ltMdlEvento);
evento_modalidade_rotas.post("/:eventoId/modalidades", adcMdlEvento);
evento_modalidade_rotas.delete("/:eventoId/modalidades/:modalidadeId",rmvMdlEvento);

export default evento_modalidade_rotas;