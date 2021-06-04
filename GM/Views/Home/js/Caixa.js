var caixa = new class Caixa {

    constructor() { }

    Arranque() {
        $('#FiDia').val("1");
        $('#FiMes').val(new Date().getMonth() + 1);
        $('#FiAno').val(new Date().getFullYear());

        $('#FnDia').val(new Date().getDate());
        $('#FnMes').val(new Date().getMonth() + 1);
        $('#FnAno').val(new Date().getFullYear());

        $('#TxMes').val(new Date().getMonth() + 1);
        $('#TxAno').val(new Date().getFullYear());

        $('#TxValor').maskMoney();
        this.SetarDados();
    }

    SetarDados() {
        var tab = document.getElementById("dadosCaixa");
        for (var i = tab.rows.length - 1; i >= 0; i--) {
            tab.deleteRow(i);
        }

        var corpo = JSON.stringify({
            chave: sessionStorage.getItem("sessao"),
            solicitacao: {
                inicio: $("#FiAno").val() + "-" + $("#FiMes").val() + "-" + $("#FiDia").val(),
                final: $("#FnAno").val() + "-" + $("#FnMes").val() + "-" + $("#FnDia").val(),
            }
        });
        fetch('/API/caixa', { method: 'POST', body: corpo, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(response => { return response.json(); })
        .then(responseData => { return responseData; })
        .then(dados => {
            data = JSON.parse(dados);
            if (data.condicao) {
                var CaixaAnt;
                var tabela = "";
                for (const registro of data.resultado) {
                    if (CaixaAnt == undefined) {
                        tabela = tabela + this.novoTitulo(registro);
                        tabela = tabela + this.novoRegistro(registro);
                    } else if ((CaixaAnt.dtcaixa.substring(8, 10) + "/" + CaixaAnt.dtcaixa.substring(5, 7)) == (registro.dtcaixa.substring(8, 10) + "/" + registro.dtcaixa.substring(5, 7))) {
                        tabela = tabela + this.novoRegistro(registro);
                    } else {
                        tabela = tabela + this.novoSaldo(CaixaAnt.saldo);
                        tabela = tabela + this.novoTitulo(registro);
                        tabela = tabela + this.novoRegistro(registro);
                    }
                    CaixaAnt = registro;
                }
                tabela = tabela + this.novoSaldo(CaixaAnt.saldo);
                $("#dadosCaixa").html(tabela);
            } else {
                tata.error('Erro', data.mensagem, { position: 'bm' });
            }
        })
        .catch(Erro => {
            tata.error('Erro', Erro, { position: 'bm' });
        });
    }

    cadastrarCaixa() {
        var corpo = JSON.stringify({
            chave: sessionStorage.getItem('sessao'),
            solicitacao: {
                codigo: 0,
                dtcaixa: $("#TxAno").val() + "-" + $("#TxMes").val() + "-" + $("#TxDia").val(),
                descricao: $("#TxDescricao").val(),
                tipo: parseInt($("#TxTipo").val()),
                valor: parseFloat($("#TxValor").val())
            }
        });

        fetch('/API/caixa', { method: 'PUT', body: corpo, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(response => { return response.json(); })
        .then(responseData => { return responseData; })
        .then(dados => {
            data = JSON.parse(dados);
            if (data.condicao) {
                tata.success('Sucesso', data.mensagem, { position: 'bm' });
                this.SetarDados();
                this.limparCampos();
            } else if (data.mensagem == "Sessão expirada.") {
                mdSessao.show();
            } else {
                tata.error('Erro', data.mensagem, { position: 'bm' });
            }
        })
        .catch(Erro => {
            tata.error('Erro', Erro, { position: 'bm' });
        });
    }

    limparCampos() {
        $("#TxAno").val(new Date().getFullYear());
        $("#TxMes").val(new Date().getMonth() + 1);
        $("#TxDia").val(new Date().getDay());
        $("#TxValor").val("");
        $("#TxDescricao").val("");
    }

    novoTitulo(caixa) {
        var tabela = "<tr class='text-center table-secondary'><td colspan='3'><b>DIA " + caixa.dtcaixa.substring(8, 10) + "/" + caixa.dtcaixa.substring(5, 7) + "</b></td></tr>";
        return tabela;
    }

    novoSaldo(saldo) {
        var tabela = "";
        if (saldo < 0) {
            tabela = "<tr class='table-danger'><td colspan='2' class='text-end'><b>SALDO DO DIA</b></td><td><b>R$ " + saldo.toFixed(2) + "</b></td></tr>";
        } else {
            tabela = "<tr class='table-success'><td colspan='2' class='text-end'><b>SALDO DO DIA</b></td><td><b>R$ " + saldo.toFixed(2) + "</b></td></tr>";
        }
        return tabela;
    }

    novoRegistro(caixa) {
        var tabela = "<tr><td><a class='text-danger pe-2' href='#'><i class='bi bi-x-lg'></i></a>" + caixa.descricao + "</td>";
        if (caixa.tipo == 0) {
            tabela = tabela + "<td>Crédito</td>";
            tabela = tabela + "<td class='text-start'><label class='text-success'>R$ " + caixa.valor.toFixed(2) + "</label></td></tr>";
        } else {
            tabela = tabela + "<td>Débito</td>";
            tabela = tabela + "<td class='text-start'><label class='text-danger'>R$ " + caixa.valor.toFixed(2) + "</label></td></tr>";
        }
        return tabela;
    }
}