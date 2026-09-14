import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastrar(event) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        const nomeLimpo = nome.trim();
        const emailLimpo = email.trim().toLowerCase();

        if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            const resposta = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeLimpo,
                    email: emailLimpo,
                    senha: senha,
                }),
            });

            let dados = {};

            try {
                dados = await resposta.json();
            } catch {
                dados = {};
            }

            if (!resposta.ok) {
                if (resposta.status === 409) {
                    throw new Error(
                        "Já existe um usuário com esse email."
                    );
                }

                throw new Error(
                    dados.mensagem ||
                        dados.Mensagem ||
                        "Não foi possível realizar o cadastro."
                );
            }

            setSucesso(
                "Cadastro realizado com sucesso! Redirecionando para o login..."
            );

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);
        } catch (error) {
            console.error("Erro no cadastro:", error);

            if (
                error instanceof TypeError &&
                error.message.includes("fetch")
            ) {
                setErro(
                    "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
                );
            } else {
                setErro(
                    error.message ||
                        "Não foi possível realizar o cadastro."
                );
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span>🏆</span>
                </div>

                <div className="auth-header">
                    <h1>Criar conta</h1>

                    <p>
                        Cadastre-se para acessar o IF Esporte
                    </p>
                </div>

                <form onSubmit={cadastrar}>
                    <div className="form-group">
                        <label htmlFor="nome">
                            Nome completo
                        </label>

                        <input
                            id="nome"
                            type="text"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={(event) =>
                                setNome(event.target.value)
                            }
                            disabled={carregando}
                            required
                        />
                    </div>

                    <div className="form-group">
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
                            disabled={carregando}
                            required
                        />
                    </div>

                    <div className="form-group">
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
                            disabled={carregando}
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmarSenha">
                            Confirmar senha
                        </label>

                        <input
                            id="confirmarSenha"
                            type="password"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={(event) =>
                                setConfirmarSenha(event.target.value)
                            }
                            disabled={carregando}
                            minLength={6}
                            required
                        />
                    </div>

                    {erro && (
                        <div className="auth-error">
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div className="auth-success">
                            {sucesso}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Criando conta..."
                            : "Criar conta"}
                    </button>
                </form>

                <div className="auth-footer">
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