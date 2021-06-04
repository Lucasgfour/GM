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
    public class SessaoController : ControllerBase {

        [HttpGet]
        public String teste() {
            return JsonConvert.SerializeObject(new ObjectDao<Sessao>().listar());
        }

        [HttpPost]
        public String Post([FromBody] Usuario user) { 
            try { 
                ObjectDao<Usuario> uDao = new ObjectDao<Usuario>();
                ObjectDao<Sessao> sDao = new ObjectDao<Sessao>("", false);

                Resultado res = uDao.consultar("SELECT * FROM usuario WHERE login = '" + user.login + "' AND senha = MD5('" + user.senha + "')");      
                if (!res.condicao) {
                    return JsonConvert.SerializeObject(res);
                } else {
                    Usuario us = (Usuario)res.resultado;
                    
                    Sessao novaSessao = new Sessao();
                    novaSessao.chave = Ferramentas.ToMD5(DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss") + us.login);
                    novaSessao.usuario = us.codigo;
                    novaSessao.horario = DateTime.Now;
                    novaSessao.ativa = 1;

                    new Comando("UPDATE sessao SET ativa = 0 WHERE usuario = " + us.codigo).executar();
                    Resultado inic = sDao.inserir(novaSessao);
                    if(inic.condicao) {    
                        return JsonConvert.SerializeObject(new Resultado(true, "Logado com sucesso !", novaSessao.chave));
                    } else {
                        return JsonConvert.SerializeObject(inic);
                    }

                }
            } catch (Exception e) {
                return JsonConvert.SerializeObject(new Resultado(false, e.ToString()));
            }
        }


    }
}
