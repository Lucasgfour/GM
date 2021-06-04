function arranque() {
    if(sessionStorage.getItem("id_sessao") == undefined) {
        
    } else {
        
    }
}



function logar() {
    data = { codigo: 0, nome: "", banco: "", permissao: 1, situacao: 1, login: document.getElementById('TxLogin').value, senha: document.getElementById('TxSenha').value };
    saida = JSON.stringify(data);
    fetch('/API/sessao', { method: 'POST', body: saida, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }})
    .then(response => { return response.json(); })
    .then(responseData => { console.log(responseData); return responseData; })
    .then(dados => {
        data = JSON.parse(dados);
        if(data.condicao) {
            sessionStorage.setItem('sessao', data.resultado);
            tata.success("Logado", data.mensagem);
            window.location.href = '/Home';
        } else {
            tata.error('Erro', data.mensagem, { position: 'bm' }); 
        }
    })
    .catch(Erro => {
        tata.error('Erro', Erro, { position: 'bm' }); 
    });
}