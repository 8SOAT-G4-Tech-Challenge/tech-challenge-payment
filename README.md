## FIAP Tech-Challenge 8SOAT - Grupo 04

### Microsserviço de Pagamentos

Este microsserviço faz parte de um sistema de controle de pedidos para uma lanchonete em expansão.
Ele é responsável exclusivamente pelo processo de pagamento, garantindo uma integração eficiente e segura com a API do Mercado Pago para gerar QR Codes de pagamento.

### Objetivo

Este serviço tem como objetivo gerenciar os pagamentos dos pedidos, possibilitando que os clientes efetuem transações de forma rápida e integrada ao sistema da lanchonete.

A partir dos dados do pedido, este microsserviço:

- Cria uma solicitação de pagamento associada ao pedido.
- Integra-se ao Mercado Pago para gerar um QR Code.
- Fornece o QR Code ao cliente para realizar o pagamento.
- Acompanha o status do pagamento e atualiza o pedido conforme necessário.

### Principais funcionalidades:

- **Pagamento Integrado**: Facilitar o pagamento dos pedidos via QRCode do Mercado Pago.

### Requerimentos

- Node versão 20
- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose

### Execução

Para executar a aplicação siga a seguinte [documentação](docs/INSTALACAO.md), que possui todos os passos para iniciar e executar a aplicação localmente.

### Participantes do Projeto

- Amanda Maschio - RM 357734
- Jackson Antunes - RM357311
- Lucas Accurcio - RM 357142
- Vanessa Freitas - RM 357999
- Winderson Santos - RM 357315
