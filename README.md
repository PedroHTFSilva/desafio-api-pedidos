# 📦 API de Pedidos - Desafio Técnico

API RESTful desenvolvida em Node.js para gerenciamento de pedidos, com persistência de dados no MongoDB e documentação via Swagger.


## 🚀 Tecnologias Utilizadas

* **Node.js** & **Express**: Estrutura do servidor e rotas.
* **MongoDB** & **Mongoose**: Banco de dados NoSQL e modelagem de dados (Schema).
* **Swagger UI**: Documentação interativa da API.
* **JavaScript (ES6+)**: Lógica de backend.

## ⚙️ Funcionalidades Principais

1.  **CRUD Completo**: Criação, Leitura, Atualização e Exclusão de pedidos.
2.  **Data Mapping (Transformação)**:
    * Recebe JSON com chaves em Português (ex: `numeroPedido`, `valorTotal`).
    * Transforma e salva em Inglês (ex: `orderId`, `value`).
    * Conversão de tipos (String para Number no ID do item).
3.  **Documentação**: Interface Swagger disponível em `/api-docs`.
4.  **Tratamento de Erros**: Respostas HTTP consistentes (201, 200, 400, 404, 500).

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* [MongoDB](https://www.mongodb.com/) rodando localmente ou conexão Atlas.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/nome-do-repo.git](https://github.com/SEU_USUARIO/nome-do-repo.git)
    cd nome-do-repo
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados:**
    * O projeto tenta conectar em `mongodb://127.0.0.1:27017/api-pedidos`.
    * Certifique-se que seu MongoDB está rodando.

4.  **Inicie o Servidor:**
    ```bash
    node server.js
    ```

5.  **Acesse a Documentação:**
     Abra o navegador em: `http://localhost:3000/api-docs`

## 🧪 Endpoints (Resumo)

| Método | Rota | Descrição |
|Data | ---- | --------- |
| **POST** | `/order` | Cria um novo pedido (Recebe PT-BR -> Salva EN) |
| **GET** | `/order/:id` | Busca um pedido pelo ID (orderId) |
| **GET** | `/order/list` | Lista todos os pedidos |
| **PUT** | `/order/:id` | Atualiza um pedido existente |
| **DELETE**| `/order/:id` | Remove um pedido |

---
Desenvolvido por **Pedro Henrique**.