import prisma from "../lib/prisma.js";

async function listarCampus(req,res){
    try{
        const campus = await prisma.campus.findMany();
        res.json(campus);

    }catch(erro){
        console.error(erro);
        res.status(500).json({
            Mensagem:"Erro ao buscar os campi"
        });
    }
}
async function buscarCampus(req,res){
    try{
        const id = Number(req.params.id);
        const campus = await prisma.campus.findUnique({
            where:{  id: id }
        });
        if (!campus){
            return res.status(404).json({
                Mensagem:"Campus não encontrado"
            });
        }
        res.json(campus)

    }catch(erro){
        console.error(erro);
        res.status(500).json({
            Mensagem:"Erro ao buscar o campus"
        })
    }
}
async function criarCampus(req,res){
    try{
        const {nome,sigla,cidade} = req.body;

        if (!nome || !sigla || !cidade){
            return res.error(400).json({
                Mensagem:"Nome, sigla e cidade são obrigatórios."
            })
        }
        const campus = await prisma.campus.create({
            data:{
                nome,
                sigla,
                cidade
            }
        });
        res.status(201).json(campus)
    }catch(erro){
        console.error(erro);
        if(erro.code === "P2002"){
            return res.status(409).json({
             Mensagem:"Já existe um campus com essa sigla."
            })
        }
        res.status(500).json({
            Mensagem: "Erro ao cadastrar o campus."
        });
    }
}
async function atualizarCampus(req, res) {
    try {
        const id = Number(req.params.id);
        const { nome, sigla, cidade } = req.body;

        if (
            nome === undefined &&
            sigla === undefined &&
            cidade === undefined
        ) {
            return res.status(400).json({
                mensagem: "Informe pelo menos um campo para atualizar."
            });
        }

        const dados = {};

        if (nome !== undefined) {
            dados.nome = nome;
        }

        if (sigla !== undefined) {
            dados.sigla = sigla;
        }

        if (cidade !== undefined) {
            dados.cidade = cidade;
        }

        const campus = await prisma.campus.update({
            where: {
                id: id
            },
            data: dados
        });

        res.json(campus);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Campus não encontrado."
            });
        }

        if (erro.code === "P2002") {
            return res.status(409).json({
                mensagem: "Já existe um campus com essa sigla."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar o campus."
        });
    }
}
async function excluirCampus(req, res) {
    try {
        const id = Number(req.params.id);

        await prisma.campus.delete({
            where: {
                id: id
            }
        });

        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({
                mensagem: "Campus não encontrado."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao excluir o campus."
        });
    }
}


export {listarCampus, buscarCampus, criarCampus, atualizarCampus, excluirCampus};
