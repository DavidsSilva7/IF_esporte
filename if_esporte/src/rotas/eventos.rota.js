import express from "express";

import {
    listarEventos,
    criarEvento,
    atualizarEvento,
    excluirEvento
} from "../controladores/evento.ctl.js";

import autenticar from "../middleware/autenticador.js";
import autorizar from "../middleware/autorizar.js";

const evento_rotas = express.Router();

// Público
evento_rotas.get("/", listarEventos);

// ADMIN ou ORGANIZADOR
evento_rotas.post(
    "/",
    autenticar,
    autorizar("ADMIN", "ORGANIZADOR"),
    criarEvento
);

// ADMIN ou ORGANIZADOR
// A verificação de proprietário será feita no controller
evento_rotas.patch(
    "/:id",
    autenticar,
    autorizar("ADMIN", "ORGANIZADOR"),
    atualizarEvento
);

// ADMIN ou ORGANIZADOR
// A verificação de proprietário será feita no controller
evento_rotas.delete(
    "/:id",
    autenticar,
    autorizar("ADMIN", "ORGANIZADOR"),
    excluirEvento
);

export default evento_rotas;