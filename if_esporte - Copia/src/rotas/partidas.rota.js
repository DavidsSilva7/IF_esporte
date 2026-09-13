import express from "express";

import { listarPartidas, criarPartida, atualizarPartida, excluirPartida} from"../controladores/partida.ctl.js";
import autenticar from "../middleware/autenticador.js"
import autorizar from "../middleware/autorizar.js"

const partida_rotas = express.Router();

partida_rotas.get("/", listarPartidas);
partida_rotas.post("/",autenticar, autorizar("ADMIN"), criarPartida);
partida_rotas.patch("/:id",autenticar, autorizar("ADMIN"), atualizarPartida);
partida_rotas.delete("/:id",autenticar, autorizar("ADMIN"), excluirPartida);


export default partida_rotas;