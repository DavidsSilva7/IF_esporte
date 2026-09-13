import prisma from "../lib/prisma.js";

async function listarEventos(req, res) {

    try {

        const { status, campusId, dataInicio, dataFim } = req.query;
        const filtros = {};

        if (status !== undefined) {
            filtros.status = status;
        }
        if (campusId !== undefined) {
            filtros.campusId = Number(campusId);
        }
        if (dataInicio !== undefined) { 
            filtros.dataInicio = { gte: new Date(dataInicio) }; 
        }
        if (dataFim !== undefined) {
            filtros.dataFim = { lte: new Date(dataFim) };
        }

        const eventos = await prisma.evento.findMany({
            where: filtros,
            include: {
                campus: true,
                organizador: true,
                modalidades: {include: { modalidade: true}}
            },
            orderBy: { dataInicio: "asc"}
        });
        res.json(eventos);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar os eventos." });
    }

}


async function criarEvento(req, res) {
    try {
        const {titulo, descricao, dataInicio, dataFim, local, status, campusId, organizadorId } = req.body;

        if (!titulo ||!descricao ||!dataInicio ||!dataFim ||!local ||campusId === undefined || organizadorId === undefined || status === undefined) {
            return res.status(400).json({mensagem: "Todos os campos são obrigatórios."});
        }

        const evento = await prisma.evento.create({

            data: {

                titulo,
                descricao,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                local,
                status,
                campusId: Number(campusId),
                organizadorId: Number(organizadorId)
            }

        });
        res.status(201).json(evento);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2003") {
            return res.status(400).json({ mensagem: "Campus ou organizador informado não existe." });
        }

        res.status(500).json({ mensagem: "Erro ao cadastrar o evento."});
    }
}
async function atualizarEvento(req, res) {
    try {
        const id = Number(req.params.id);
        const {titulo, descricao, dataInicio, dataFim, local, campusId, status } = req.body;

        if (titulo === undefined && descricao === undefined &&dataInicio === undefined &&dataFim === undefined &&local === undefined &&campusId === undefined &&status === undefined){
            return res.status(400).json({mensagem: "Informe pelo menos um campo para atualizar."});
        }

        const dados = {};

        if (titulo !== undefined) {
            dados.titulo = titulo;
        }
        if (descricao !== undefined) {
            dados.descricao = descricao;
        }
        if (dataInicio !== undefined) {
            dados.dataInicio = new Date(dataInicio);
        }
        if (dataFim !== undefined) {
            dados.dataFim = new Date(dataFim);
        }
        if (local !== undefined) {
            dados.local = local;
        }
        if (campusId !== undefined) {
            dados.campusId = Number(campusId);
        }
        if (status !== undefined) {
            dados.status = status;
        }

        const evento = await prisma.evento.update({
            where: {id: id},
            data: dados
        });
        res.json(evento);

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({mensagem: "Evento não encontrado."});
        }
        if (erro.code === "P2003") {
            return res.status(400).json({mensagem: "Campus informado não existe."});
        }
        res.status(500).json({ mensagem: "Erro ao atualizar o evento."});

    }

}


async function excluirEvento(req, res) {
    try {
        const id = Number(req.params.id);

        await prisma.evento.delete({
            where: {id: id}
        });
        res.status(204).send();

    } catch (erro) {
        console.error(erro);

        if (erro.code === "P2025") {
            return res.status(404).json({mensagem: "Evento não encontrado."});
        }
        if (erro.code === "P2003") {
            return res.status(409).json({mensagem: "Não é possível excluir este evento, pois existem registros vinculados a ele."});
        }
        res.status(500).json({mensagem: "Erro ao excluir o evento."});
    }
}

export {listarEventos, criarEvento, atualizarEvento, excluirEvento};