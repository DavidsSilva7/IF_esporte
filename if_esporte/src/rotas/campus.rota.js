import express from "express"
import {listarCampus, buscarCampus, criarCampus, atualizarCampus, excluirCampus} from "../controladores/campus.ctl.js"
import autenticar from "../middleware/autenticador.js"
import autorizar from "../middleware/autorizar.js"
const campus_rotas = express.Router();

campus_rotas.get("/", listarCampus);
campus_rotas.get("/:id", buscarCampus);
campus_rotas.post("/",autenticar,autorizar("ADMIN"), criarCampus);
campus_rotas.put("/:id", autenticar,autorizar("ADMIN"), atualizarCampus)
campus_rotas.delete("/:id",autenticar,autorizar("ADMIN"), excluirCampus)

export default campus_rotas;