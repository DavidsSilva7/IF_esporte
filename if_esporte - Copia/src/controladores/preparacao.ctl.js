import prisma from "../lib/prisma.js";

async function listarPreparacoes(req, res) {
    try {
        const preparacoes = await prisma.preparacao.findMany({
            include: { modalidade: true, campus: true,responsavel: true},
            orderBy: { dataInicio: "asc" }
        });
        res.json(preparacoes);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar as preparações." });
    }
}


async function criarPreparacao(req, res) {
    try {
        const { titulo, descricao, tipo, modalidadeId,campusId,responsavelId, vagas,local, dataInicio, dataFim } = req.body;
        
        if (!titulo ||!descricao ||!tipo ||modalidadeId === undefined || campusId === undefined || responsavelId === undefined ||!local ||!dataInicio || !dataFim ) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados."});
        }

        const preparacao = await prisma.preparacao.create({
            data: {
                titulo,
                descricao,
                tipo,
                modalidadeId: Number(modalidadeId),
                campusId: Number(campusId),
                responsavelId: Number(responsavelId),
                vagas: vagas !== undefined ? Number(vagas) : null,
                local,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim)
            }
        });

        res.status(201).json(preparacao);

    } catch (erro) {

        console.error(erro);

        if (erro.code === "P2003") {
            return res.status(400).json({ mensagem: "Modalidade, campus ou responsável não encontrado." });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar a preparação."
        });

    }

}
async function atualizarPreparacao(req, res) {

    try {

        const id = Number(req.params.id);

        const {
            titulo,
            descricao,
            tipo,
            modalidadeId,
            campusId,
            responsavelId,
            vagas,
            local,
            dataInicio,
            dataFim
        } = req.body;


        if (
            titulo === undefined &&
            descricao === undefined &&
            tipo === undefined &&
            modalidadeId === undefined &&
            campusId === undefined &&
            responsavelId === undefined &&
            vagas === undefined &&
            local === undefined &&
            dataInicio === undefined &&
            dataFim === undefined
        ) {

            return res.status(400).json({
                mensagem: "Informe pelo menos um campo para atualizar."
            });

        }


        const dados = {};


        if (titulo !== undefined) {
            dados.titulo = titulo;
        }


        if (descricao !== undefined) {
            dados.descricao = descricao;
        }


        if (tipo !== undefined) {
            dados.tipo = tipo;
        }


        if (modalidadeId !== undefined) {
            dados.modalidadeId = Number(modalidadeId);
        }


        if (campusId !== undefined) {
            dados.campusId = Number(campusId);
        }


        if (responsavelId !== undefined) {
            dados.responsavelId = Number(responsavelId);
        }


        if (vagas !== undefined) {
            dados.vagas = vagas === null ? null : Number(vagas);
        }


        if (local !== undefined) {
            dados.local = local;
        }


        if (dataInicio !== undefined) {
            dados.dataInicio = new Date(dataInicio);
        }


        if (dataFim !== undefined) {
            dados.dataFim = new Date(dataFim);
        }


        const preparacao = await prisma.preparacao.update({

            where: {
                id: id
            },

            data: dados

        });


        res.json(preparacao);


    } catch (erro) {

        console.error(erro);


        if (erro.code === "P2025") {

            return res.status(404).json({
                mensagem: "Preparação não encontrada."
            });

        }


        if (erro.code === "P2003") {

            return res.status(400).json({
                mensagem: "Modalidade, campus ou responsável não encontrado."
            });

        }


        res.status(500).json({
            mensagem: "Erro ao atualizar a preparação."
        });

    }

}


async function excluirPreparacao(req, res) {

    try {

        const id = Number(req.params.id);


        await prisma.preparacao.delete({

            where: {
                id: id
            }

        });


        res.status(204).send();


    } catch (erro) {

        console.error(erro);


        if (erro.code === "P2025") {
            return res.status(404).json({mensagem: "Preparação não encontrada."});

        }
        res.status(500).json({
            mensagem: "Erro ao excluir a preparação."
        });

    }

}


export {
    listarPreparacoes,
    criarPreparacao,
    atualizarPreparacao,
    excluirPreparacao
};
