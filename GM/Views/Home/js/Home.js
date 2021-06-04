var Pagina = "";
var mdSessao = new bootstrap.Modal(document.getElementById('MsgSessaoExpirada'), { keyboard: false, backdrop: 'static' });

function CarregarPagina(Pagina) {
    this.Pagina = Pagina;
    pedido = JSON.stringify({ chave: sessionStorage.getItem('sessao'), solicitacao: Pagina });
    fetch('API/pagina', { method: 'POST', body: pedido, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(response => { return response.json(); })
        .then(responseData => { return responseData; })
        .then(dados => {
            data = JSON.parse(dados);
            if (data.mensagem == "Sessão expirada.") {
                mdSessao.show();
            } else if (data.condicao == false) {
                tata.error('Erro : ', data.mensagem);
            } else {
                $("#ConteudoPágina").html(data.resultado);
                AtualizarPagina(Pagina);
            }
        })
        .catch(Erro => {
            tata.error('Erro : ', Erro);
        });
}

function AtualizarPagina(Pagina) {
    try {
        if (Pagina == "Caixa") {
            caixa.Arranque();
        }
    } catch(Erro) {
      
    }
}

var PedidoRetorno;
function Pedido(Body, Method, Link) {
    pedido = JSON.stringify({ chave: sessionStorage.getItem('sessao'), solicitacao: Body });
    fetch(Link, { method: Method, body: pedido, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
    .then(response => { return response.json(); })
    .then(responseData => { return responseData; })
    .then(dados => {
        data = JSON.parse(dados);
        if (data.mensagem == "Sessão expirada.") {
            mdSessao.show();
        }
        this.PedidoRetorno = data;
    })
    .catch(Erro => {
        this.PedidoRetorno = { condicao: false, mensagem: 'Erro : ' + Erro};
    });
    return this.PedidoRetorno;
}

