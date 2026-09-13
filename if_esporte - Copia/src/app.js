import express from "express";
import cors from "cors";
import campus_rotas from "../src/rotas/campus.rota.js";
import usuarios_rotas from "../src/rotas/usuarios.rota.js"
import modalidade_rotas from "../src/rotas/modalidade.rota.js";
import evento_rotas from "../src/rotas/eventos.rota.js";
import evento_modalidade_rotas from "../src/rotas/eventoModalidade.rota.js";
import inscricao_rotas from "../src/rotas/inscricao.rota.js";
import auth_rotas from "../src/rotas/auth.rota.js";
import preparacao_rotas from "../src/rotas/preparacao.rota.js";
import partida_rotas from "../src/rotas/partidas.rota.js";
import classificacao_rotas from "../src/rotas/classificacao.rota.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());
app.use("/campus", campus_rotas);
app.use("/usuarios", usuarios_rotas);
app.use("/modalidades", modalidade_rotas);
app.use("/eventos", evento_rotas);
app.use("/eventos", evento_modalidade_rotas);
app.use("/inscricoes", inscricao_rotas);
app.use("/auth", auth_rotas)
app.use("/preparacoes", preparacao_rotas);
app.use("/partidas", partida_rotas);
app.use("/classificacoes", classificacao_rotas);

app.get("/", (req,res) =>{
    res.json({
        "mensagem":"API RODANDO"
    });
});

export default app;