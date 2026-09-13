import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

async function login(req, res) {
    try {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });

        if (!usuario) {
            return res.status(401).json({
                mensagem: "Email ou senha inválidos."
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "Email ou senha inválidos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                role: usuario.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        res.json({
            mensagem: "Login realizado com sucesso.",
            token
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao realizar login."
        });
    }
}

export { login };