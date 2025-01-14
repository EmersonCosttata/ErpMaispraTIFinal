# ErpMaispraTIFinal
Projeto FInal Curso Maisprati
ERP+pra ti
App conta com react no front e java spring no backend!

O app oferece :
Responsividade Completa!

Login seguro com autenticação via JWT;

Cadastro, edição e gestão de clientes, fornecedores, produtos, vendas, insumos e usuários;

Um dashboard totalmente personalizável, que amplia a visualização e análise das informações registradas pela empresa.

## Tecnologias: ##

## Frontend ##

axios: Para fazer requisições HTTP.

chart.js e react-chartjs-2: Gráficos interativos e dinâmicos.

jwt-decode: Decodificação de tokens JWT para validações no front-end.

react-draggable e react-resizable: Para funcionalidades de arrastar e redimensionar componentes, melhorando a experiência do dashboard.

react-router-dom: Gerenciamento de rotas no React.

Vite: Ambiente moderno para desenvolvimento, build e preview de aplicações React.

ESLint: Configurado para análise estática de código e padrões de codificação.

## Backend ##
Funcionalidades principais:

Autenticação JWT: Proteção de rotas e validação de usuários.

Swagger (SpringDoc): Para documentação e interação com a API.

MySQL: Banco de dados em produção.

H2: Banco de dados em memória para testes e desenvolvimento.

Lombok: Redução de boilerplate com anotações para getters, setters, etc.

ModelMapper: Para conversões automáticas entre DTOs e entidades.

Ferramentas de teste:

JUnit e Mockito estão configurados para criação de testes unitários e mocks.

Configurações adicionais:

Spring Boot DevTools: Para atualizações automáticas e desenvolvimento mais ágil.

Mail: Suporte a envio de emails (possivelmente para notificações ou recuperação de senha).

## Integração Front-end/Back-end ##
Fluxo de autenticação: O JWT emitido pelo back-end é usado no front para proteger rotas, sendo decodificado para validações locais.

Requisições API: O axios no front faz chamadas às rotas do back para gerenciar entidades como clientes, fornecedores e produtos.

## Link para testes ##

https://erp-maispra-ti-final.vercel.app/

## Instalação Local ##
Clonar esse repositorio primeiro, apos instalar na pasta frontend : npm i

Para rodar o front, na mesma pasta : npm run server

Backend: Abrir na sua ide de java a pasta backend (Certifique que você ja tem maven) e executar MaisPraTiApplication na pasta Main!

**Trocar no front o .env pra http:localhost:8080


