import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [campusId, setCampusId] = useState("");

    const [campi, setCampi] = useState([]);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarCampi();
    }, []);

    async function carregarCampi() {
        try {
            const resposta = await fetch(
                "http://localhost:3000/campus"
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar os campi.");
            }

            const dados = await resposta.json();

            setCampi(dados);

        } catch (erro) {
            console.error(erro);
            setErro("Não foi possível carregar os campi.");
        }
    }

    async function cadastrar(event) {
        event.preventDefault();

        setErro("");
        setSucesso("");
        setCarregando(true);

        try {
            const resposta = await fetch(
                "http://localhost:3000/usuarios",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                        campusId: Number(campusId),
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "Erro ao realizar cadastro."
                );
            }

            setSucesso("Cadastro realizado com sucesso!");

            setNome("");
            setEmail("");
            setSenha("");
            setCampusId("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (erro) {
            console.error(erro);
            setErro(erro.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    🏆
                </div>

                <h1>Criar conta</h1>

                <p className="login-subtitulo">
                    Cadastre-se no IF Esporte
                </p>

                <form onSubmit={cadastrar}>

                    <div className="login-campo">
                        <label htmlFor="nome">
                            Nome
                        </label>

                        <input
                            id="nome"
                            type="text"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={(event) =>
                                setNome(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="senha">
                            Senha
                        </label>

                        <input
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(event) =>
                                setSenha(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="login-campo">
                        <label htmlFor="campus">
                            Campus
                        </label>

                        <select
                            id="campus"
                            value={campusId}
                            onChange={(event) =>
                                setCampusId(event.target.value)
                            }
                            required
                        >
                            <option value="">
                                Selecione seu campus
                            </option>

                            {campi.map((campus) => (
                                <option
                                    key={campus.id}
                                    value={campus.id}
                                >
                                    {campus.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {erro && (
                        <div className="login-erro">
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div className="login-sucesso">
                            {sucesso}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-botao"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Cadastrando..."
                            : "Cadastrar"}
                    </button>

                </form>

                <div className="login-cadastro">
                    <span>
                        Já possui uma conta?
                    </span>

                    <Link to="/login">
                        Entrar
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default Cadastro;