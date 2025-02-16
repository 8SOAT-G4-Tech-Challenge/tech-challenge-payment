## FIAP Tech-Challenge 8SOAT - Grupo 04 - Microsserviço de Pagamentos

### Introdução

Este microsserviço faz parte de um sistema de controle de pedidos para uma lanchonete em expansão. Ele é responsável exclusivamente pelo processo de pagamento, garantindo uma integração eficiente e segura com a API do Mercado Pago para gerar QR Codes de pagamento.

_Para visualizar a documentação geral do projeto, acesse este [repositório](https://github.com/8SOAT-G4-Tech-Challenge/tech-challenge-fiap-documentation)._

### Objetivo

Este serviço tem como objetivo gerenciar os pagamentos dos pedidos, possibilitando que os clientes efetuem transações de forma rápida e integrada ao sistema da lanchonete.

A partir dos dados do pedido, este microsserviço:

- Cria uma solicitação de pagamento associada ao pedido.
- Integra-se ao Mercado Pago para gerar um QR Code.
- Fornece o QR Code ao cliente para realizar o pagamento.
- Acompanha o status do pagamento e atualiza o pedido conforme necessário.

### Participantes

- Amanda Maschio - RM 357734
- Jackson Antunes - RM357311
- Lucas Accurcio - RM 357142
- Vanessa Freitas - RM 357999
- Winderson Santos - RM 357315
