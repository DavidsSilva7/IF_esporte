import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function fazerLogin(event) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            const resposta = await fetch(
                "http://localhost:3000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        senha,
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "E-mail ou senha inválidos."
                );
            }

            localStorage.setItem("token", dados.token);

            localStorage.setItem(
                "usuario",
                JSON.stringify(dados.usuario)
            );

            navigate("/dashboard", { replace: true });

        } catch (erro) {
            console.error(erro);
            setErro(erro.message);
        } finally {
            setCarregando(false);
        }
    }

    function entrarComoVisitante() {
        localStorage.removeItem("token");

        localStorage.setItem(
            "usuario",
            JSON.stringify({
                id: null,
                nome: "Visitante",
                role: "VISITANTE",
            })
        );

        navigate("/eventos", { replace: true });
    }

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    🏆
                </div>

                <h1>IF Esporte</h1>

                <p className="login-subtitulo">
                    Plataforma Esportiva
                </p>

                <form onSubmit={fazerLogin}>

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

                        <div className="login-label-senha">

                            <label htmlFor="senha">
                                Senha
                            </label>

                            <Link
                                to="/esqueci-senha"
                                className="esqueci-senha"
                            >
                                Esqueci minha senha
                            </Link>

                        </div>

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

                    {erro && (
                        <div className="login-erro">
                            {erro}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-botao"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Entrando..."
                            : "Entrar"}
                    </button>

                </form>

                <div className="login-divisor">
                    <span>ou</span>
                </div>

                <button
                    type="button"
                    className="login-visitante"
                    onClick={entrarComoVisitante}
                >
                    Entrar como visitante
                </button>

                <div className="login-cadastro">

                    <span>
                        Ainda não possui uma conta?
                    </span>

                    <Link to="/cadastro">
                        Cadastre-se
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;