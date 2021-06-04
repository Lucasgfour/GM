
var campos = [];

function CarregarCampos() {
    min = new Date().getFullYear() - 10;
    campos = "";
    for (i = min; i < new Date().getFullYear(); i++) {
        campos[i] = "TxCampo" + i;
        campos = campos + 
            '<div class="row">' +
            '   <div class="col-lg-12">' +
            '        <div class="input-group mb-2">' +
            '           <label class="input-group-text rounded-0">' + i + '</label>' +
            '           <input class="form-control rounded-0" onchange="CalculoCrescimento(' + i + ')" id="TxCampo' + i + '" type="text" placeholder="R$ 0,00">' +
            '           <label id="label' + i + '" class="input-group-text rounded-0 w-25">0,00 %</label>' +
            '        </div>' +
            '    </div>' +
            '</div>';
    }
    $("#Campos").html(campos);
}

function CalculoCrescimento(ano) {
    try {
        valAnt = parseFloat($("#TxCampo" + (ano-1)).val());
        val = parseFloat($("#TxCampo" + ano).val());
        Crescimento = CrescA(valAnt, val) / CrescB(valAnt) * 100;
        if((Crescimento+ " %") == "NaN %") {
            $("#label" + ano).val("0,00 %")
        } else {
            $("#label" + ano).html(Crescimento.toFixed(2) + " %");
        }
    } catch (error) {
        console.log(error);
        $("#label" + ano).val("0,00 %")
    }
}

var Valores = [];

function Calcular() {
    min = new Date().getFullYear() - 10;
    ant = 0;
    total = 0;
    totalCrescimento = 0;
    for (i = min; i < new Date().getFullYear(); i++) {
        val2 = parseFloat($("#TxCampo" + i).val());
        if(ant > 0) {
            Crescimento = CrescA(ant, val2) / CrescB(ant);
            totalCrescimento += Crescimento;
        }
        total += val2;
        ant = val2;
    }
    
    Previsao(total, (totalCrescimento / 9));
}

function Previsao(LucroTotal, CrescimentoTotal) {
    Limpar();
    max = new Date().getFullYear() + 10;

    pPessimista = CrescimentoTotal - (CrescimentoTotal * 0.5);
    pNormal = CrescimentoTotal;
    pOtimista = CrescimentoTotal + (CrescimentoTotal * 0.5);

    pPresenteP = pPessimista * 0.7;
    pPresenteN = pNormal * 0.7;
    pPresenteO = pOtimista * 0.7;

    tPresenteP = 0;
    tPresenteN = 0;
    tPresenteO = 0;

    vAntP = 0;
    vAntN = 0;
    vAntO = 0;

    index = 0;

    tPessimista = 0;
    tNormal = 0;
    tOtimista = 0;

    $("#TitP").html("Pessismista " + (pPessimista * 100).toFixed(2) + "%");
    $("#TitN").html("Normal " + (pNormal * 100).toFixed(2) + "%");
    $("#TitO").html("Otimista " + (pOtimista * 100).toFixed(2) + "%");

    var tabela = document.getElementById("tabelaCrescimento");
    var desconto = document.getElementById("tabelaDesconto");

    for (let i = new Date().getFullYear(); i <= max; i++) {
        index += 1;
        var row = tabela.insertRow(-1);
        row.insertCell(-1).innerHTML = i;
        if(i == new Date().getFullYear()) {
            vPAnt = LucroTotal + (LucroTotal * pPessimista);
            vNAnt = LucroTotal + (LucroTotal * pNormal);
            vOAnt = LucroTotal + (LucroTotal * pOtimista);
        } else {
            vPAnt = vPAnt + (vPAnt * pPessimista);
            vNAnt = vNAnt + (vNAnt * pNormal);
            vOAnt = vOAnt + (vOAnt * pOtimista);
        }
        row.insertCell(-1).innerHTML = "R$ " +  Intl.NumberFormat().format(parseInt((vPAnt / 10)));
        row.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt((vNAnt / 10)));
        row.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt((vOAnt / 10)));

        tPessimista += vPAnt;
        tNormal += vNAnt;
        tOtimista += vOAnt;

        tPresenteP += CalculoDesconto(vPAnt, pPresenteP, index);
        tPresenteN += CalculoDesconto(vNAnt, pPresenteN, index);
        tPresenteO += CalculoDesconto(vOAnt, pPresenteO, index);

        var lin = desconto.insertRow(-1);
        lin.insertCell(-1).innerHTML = "Presente " + index;
        lin.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt(CalculoDesconto(vPAnt, pPresenteP, index)));
        lin.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt(CalculoDesconto(vNAnt, pPresenteN, index)));
        lin.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt(CalculoDesconto(vOAnt, pPresenteO, index)));
    }

    var row = tabela.insertRow(-1);
    row.insertCell(-1).innerHTML = "TOTAL"
    row.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt((tPessimista / 10)));
    row.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt((tNormal / 10)));
    row.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt((tOtimista / 10)));

    var lin = desconto.insertRow(-1);
    lin.insertCell(-1).innerHTML = "TOTAL ";
    lin.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt(tPresenteP));
    lin.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt(tPresenteN));
    lin.insertCell(-1).innerHTML = "R$ " + Intl.NumberFormat().format(parseInt(tPresenteO));
}

function CalculoDesconto(val, perc, index) {
    return ((val / 10) / Math.pow((1 + perc), index));
}

function Limpar() {
    var tabela = document.getElementById("tabelaCrescimento");
	for(var i = tabela.rows.length -1; i >= 0 ; i--) {
		tabela.deleteRow(i);
	}

    var tabela = document.getElementById("tabelaDesconto");
	for(var i = tabela.rows.length -1; i >= 0 ; i--) {
		tabela.deleteRow(i);
	}
}

function CrescA(val1, val2) {
    if(val1 < 0) {
        return val2 + val1;
    } else {
        return val2 - val1;
    }
}

function CrescB(val1) {
    if(val1 < 0) {
        return val1 * -1;
    } else {
        return val1;
    }
}