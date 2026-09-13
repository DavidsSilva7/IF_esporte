import prisma from "../lib/prisma.js";


async function listarClassificacoes(req, res) {

    try {

        const { eventoId, modalidadeId } = req.query;

        const filtros = {};

        if (eventoId !== undefined) {
            filtros.eventoId = Number(eventoId);
        }

        if (modalidadeId !== undefined) {
            filtros.modalidadeId = Number(modalidadeId);
        }

        const classificacoes = await prisma.classificacao.findMany({

            where: filtros,

            include: {
                evento: true,
                modalidade: true,
                campus: true
            },

            orderBy: [
                {
                    pontos: "desc"
                }
            ]

        });

        res.json(classificacoes);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar a classificação."
        });

    }

}


async function criarClassificacao(req, res) {

    try {

        const {
            eventoId,
            modalidadeId,
            campusId
        } = req.body;


        if (
            eventoId === undefined ||
            modalidadeId === undefined ||
            campusId === undefined
        ) {

            return res.status(400).json({
                mensagem: "Evento, modalidade e campus são obrigatórios."
            });

        }


        const classificacao = await prisma.classificacao.create({

            data: {
                eventoId: Number(eventoId),
                modalidadeId: Number(modalidadeId),
                campusId: Number(campusId)
            }

        });


        res.status(201).json(classificacao);


    } catch (erro) {

        console.error(erro);


        if (erro.code === "P2002") {

            return res.status(409).json({
                mensagem: "Este campus já possui classificação para esta modalidade e evento."
            });

        }


        if (erro.code === "P2003") {

            return res.status(400).json({
                mensagem: "Evento, modalidade ou campus não encontrado."
            });

        }


        res.status(500).json({
            mensagem: "Erro ao criar a classificação."
        });

    }

}


async function atualizarClassificacao(req, res) {

    try {

        const id = Number(req.params.id);

        const {
            jogos,
            vitorias,
            empates,
            derrotas,
            golsPro,
            golsContra,
            pontos
        } = req.body;


        const dados = {};


        if (jogos !== undefined) {
            dados.jogos = Number(jogos);
        }

        if (vitorias !== undefined) {
            dados.vitorias = Number(vitorias);
        }

        if (empates !== undefined) {
            dados.empates = Number(empates);
        }

        if (derrotas !== undefined) {
            dados.derrotas = Number(derrotas);
        }

        if (golsPro !== undefined) {
            dados.golsPro = Number(golsPro);
        }

        if (golsContra !== undefined) {
            dados.golsContra = Number(golsContra);
        }

        if (pontos !== undefined) {
            dados.pontos = Number(pontos);
        }


        if (Object.keys(dados).length === 0) {

            return res.status(400).json({
                mensagem: "Informe pelo menos um campo para atualizar."
            });

        }


        const classificacao = await prisma.classificacao.update({

            where: {
                id: id
            },

            data: dados

        });


        res.json(classificacao);


    } catch (erro) {

        console.error(erro);


        if (erro.code === "P2025") {

            return res.status(404).json({
                mensagem: "Classificação não encontrada."
            });

        }


        res.status(500).json({
            mensagem: "Erro ao atualizar a classificação."
        });

    }

}


async function excluirClassificacao(req, res) {

    try {

        const id = Number(req.params.id);


        await prisma.classificacao.delete({

            where: {
                id: id
            }

        });


        res.status(204).send();


    } catch (erro) {

        console.error(erro);


        if (erro.code === "P2025") {

            return res.status(404).json({
                mensagem: "Classificação não encontrada."
            });

        }


        res.status(500).json({
            mensagem: "Erro ao excluir a classificação."
        });

    }

}


export {
    listarClassificacoes,
    criarClassificacao,
    atualizarClassificacao,
    excluirClassificacao
};