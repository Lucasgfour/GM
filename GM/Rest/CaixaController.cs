using GM.Controllers;
using GM.Recursos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GM.Rest {
    [Route("API/[controller]")]
    [ApiController]
    public class CaixaController : ControllerBase {

        [HttpPost]
        public String GetPeriodo([FromBody] Pedido req) {
            Resultado dadosSessao = req.GetSessao();
            if(!dadosSessao.condicao) {
                return JsonConvert.SerializeObject(dadosSessao);
            } else {
                try {
                    Periodo solici = JsonConvert.DeserializeObject<Periodo>(req.solicitacao.ToString());
                    Sessao sessao = (Sessao)dadosSessao.resultado;
                    Comando comando = new Comando("SELECT codigo, dtcaixa, descricao, tipo, valor, (SELECT SUM(valor) FROM caixa WHERE dtcaixa <= a.dtcaixa) AS saldo FROM caixa AS a WHERE dtcaixa >= @dtStart AND dtcaixa <= @dtFinal ORDER BY dtcaixa ASC", sessao.getUsuario().banco);
                    comando.addParametro("@dtStart", solici.inicio);
                    comando.addParametro("@dtFinal", solici.final);
                    return JsonConvert.SerializeObject(comando.ConsultarToJson());
                } catch(Exception ePeriodo) {
                    Console.WriteLine(ePeriodo.ToString());
                    return JsonConvert.SerializeObject(new Resultado(false, "Erro no servidor : " + ePeriodo.Message));
                } 
            }
        }

        [HttpPut]
        public string NovoCaixa([FromBody] Pedido req) {
            Resultado dadosSessao = req.GetSessao();
            if (!dadosSessao.condicao) {
                return JsonConvert.SerializeObject(dadosSessao);
            } else {
                try {
                    Caixa caixa = JsonConvert.DeserializeObject<Caixa>(req.solicitacao.ToString());
                    Sessao sessao = (Sessao)dadosSessao.resultado;
                    if(caixa.tipo == 1 && caixa.valor > 0) {
                        caixa.valor = caixa.valor * -1;
                    }
                    ObjectDao<Caixa> cDao = new ObjectDao<Caixa>(sessao.getUsuario().banco);
                    return JsonConvert.SerializeObject(cDao.inserir(caixa));
                } catch (Exception eNovo) {
                    Console.WriteLine(eNovo.ToString());
                    return JsonConvert.SerializeObject(new Resultado(false, "Erro no servidor : " + eNovo.Message));
                }
            }
        }

        [HttpDelete]
        public String DeletarCaixa([FromBody] Pedido req) {
            Resultado dadosSessao = req.GetSessao();
            if (!dadosSessao.condicao) {
                return JsonConvert.SerializeObject(dadosSessao);
            } else {
                try {
                    int codigo = (int)req.solicitacao;
                    Sessao sessao = (Sessao)dadosSessao.resultado;
                    ObjectDao<Caixa> cDao = new ObjectDao<Caixa>(sessao.getUsuario().banco);
                    Resultado consulta = cDao.consultar(codigo);
                    if(consulta.condicao) {
                        return JsonConvert.SerializeObject(cDao.delete(codigo));
                    } else {
                        return JsonConvert.SerializeObject(consulta);
                    }
                } catch (Exception eDeletar) {
                    Console.WriteLine(eDeletar.ToString());
                    return JsonConvert.SerializeObject(new Resultado(false, "Erro no servidor : " + eDeletar.Message));
                }
            }
        }

    }
}
