const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger.json'); 

const app = express();
app.use(express.json());

// ---SWAGGER
//http://localhost:3000/api-docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---CONEXÃO COM O MONGODB 
// Se tiver o MongoDB instalado no PC, use: 'mongodb://127.0.0.1:27017/api-pedidos'
mongoose.connect('mongodb://127.0.0.1:27017/api-pedidos')
    .then(() => console.log('✅ Conectado ao MongoDB!'))
    .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// ---CRIAÇÃO DO MODELO (SCHEMA) ---
// Define a estrutura exata pedida
const PedidoSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [{
        productId: { type: Number, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }]
});


const Pedido = mongoose.model('Pedido', PedidoSchema);

// ---FUNÇÃO DE MAPPING 
function mapearParaBanco(pedidoEntrada) {
    return {
        orderId: pedidoEntrada.numeroPedido,
        value: pedidoEntrada.valorTotal,
        creationDate: pedidoEntrada.dataCriacao,
        items: pedidoEntrada.items.map(item => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
}

// ---ROTAS

//CRIAR PEDIDO (POST)
app.post('/order', async (req, res) => {
    try {
        const dadosRecebidos = req.body;

        if (!dadosRecebidos.numeroPedido) {
            return res.status(400).json({ error: "Campo 'numeroPedido' é obrigatório." });
        }

        // Mapeia os dados
        const dadosFormatados = mapearParaBanco(dadosRecebidos);

        //Cria e salva no MongoDB
        const novoPedido = await Pedido.create(dadosFormatados);

        console.log("Pedido salvo no Banco:", novoPedido);
        res.status(201).json({ message: "Pedido criado!", data: novoPedido });

    } catch (error) {
        // Se tentar criar um ID repetido, o Mongo avisa erro com código 11000
        if (error.code === 11000) {
            return res.status(400).json({ error: "Já existe um pedido com esse ID." });
        }
        res.status(500).json({ error: error.message });
    }
});

//OBTER PEDIDO POR ID (GET)
app.get('/order/:id', async (req, res) => {
    try {
        const idProcurado = req.params.id;
        
        // Busca no MongoDB pelo campo 'orderId' (não pelo _id interno do Mongo)
        const pedido = await Pedido.findOne({ orderId: idProcurado });

        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ message: "Pedido não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//LISTAR TODOS (GET)
app.get('/order/list', async (req, res) => {
    try {
        // Busca tudo no banco
        const pedidos = await Pedido.find();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ATUALIZAR PEDIDO (PUT)
app.put('/order/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const dadosNovos = mapearParaBanco(req.body);

        // Procura e atualiza.
        const pedidoAtualizado = await Pedido.findOneAndUpdate(
            { orderId: id },
            dadosNovos,
            { new: true } 
        );

        if (pedidoAtualizado) {
            res.status(200).json({ message: "Atualizado!", data: pedidoAtualizado });
        } else {
            res.status(404).json({ message: "Pedido não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETAR PEDIDO (DELETE)
app.delete('/order/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const resultado = await Pedido.findOneAndDelete({ orderId: id });

        if (resultado) {
            res.status(200).json({ message: "Pedido deletado com sucesso." });
        } else {
            res.status(404).json({ message: "Pedido não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
});
