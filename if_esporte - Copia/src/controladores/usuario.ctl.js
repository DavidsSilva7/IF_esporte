import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

async function listarUsuarios(req, res) {
    try {
        const usuarios = await prisma.usuario.findMany();

        res.json(usuarios);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar os usuários."
        });
    }
}
async function criarUsuario(req, res) {
    try {
        const { nome, email, senha, campusId } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: "Nome, email e senha são obrigatórios."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                campusId
            }
        });

        res.status(201).json(usuario);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Já existe um usuário com esse email."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar o usuário."
        });
    }
}
async function atualizarUsuario(req, res) {
    try {
        const id = Number(req.params.id);

        const { nome, email, campusId } = req.body;

        if (!nome && !email && campusId === undefined) {
            return res.status(400).json({
                mensagem: "Informe pelo menos um campo para atualizar."
            });
        }

        const dados = {};

        if (nome !== undefined) {
            dados.nome = nome;
        }

        if (email !== undefined) {
            dados.email = email;
        }

        if (campusId !== undefined) {
            dados.campusId = campusId;
        }

        const usuario = await prisma.usuario.update({
            where: {
                id: id
            },
            data: dados
        });

        res.json(usuario);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Já existe um usuário com esse email."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar o usuário."
        });
    }
}
async function excluirUsuario(req, res) {
    try {
        const id = Number(req.params.id);

        await prisma.usuario.delete({
            where: { id: id } 
        });

        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        if (erro.code === "P2003") {
            return res.status(409).json({
                mensagem: "Não é possível excluir este usuário, pois existem registros vinculados a ele."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao excluir o usuário."
        });
    }
}

async function alterarRole(req,res){

    
    try{
        const id = Number(req.params.id);
        const {role} = req.body;
        const rolesPermitidas = ["ADMIN","ORGANIZADOR","REPRESENTANTE"]
       

        if(!role){
            return res.status(400).json({Mensagem:"Informe a função do usuário"})
        }
        if(!rolesPermitidas.includes(role)){
         return res.status(400).json({Mensagem:"Função inválida"});
        } 
        const usuario = await prisma.usuario.update({
            where:{id: id},
            data: {role: role}
        });
        res.json(usuario);
        
    }catch(erro){
        
        console.error(erro);
        if(erro.code ==="P2025"){
            return res.status(404).json({Mensagem:"Usuario não encontrado"})
        }
        res.status(500).json({
            mensagem: "Erro ao alterar a função do usuário."
        });
    }
    
}
export {listarUsuarios, criarUsuario, atualizarUsuario, excluirUsuario, alterarRole};

