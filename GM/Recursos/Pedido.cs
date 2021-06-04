using GM.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GM.Recursos {
    public class Pedido {
        public String chave { get; set; }
        public Object solicitacao { get; set; }

        public Resultado GetSessao() {
            ObjectDao<Sessao> oDao = new ObjectDao<Sessao>("", false, "gm");
            ObjectDao<Usuario> uDao = new ObjectDao<Usuario>();
            Resultado a = oDao.consultar("SELECT * FROM sessao WHERE chave = '" + chave + "'");
            if(!a.condicao) {
                return new Resultado(false, "Sessão não encontrada !");
            } else {
                Sessao sessao = (Sessao)a.resultado;
                Resultado u = uDao.consultar(sessao.usuario);
                if(!u.condicao) {
                    return new Resultado(false, "Usuário não localizado !");
                } else {
                    sessao.setUsuario((Usuario)u.resultado);
                    if (sessao.horario < DateTime.Now.AddHours(4) && sessao.ativa == 1) {
                        if(sessao.getUsuario().situacao != 1) {
                            return new Resultado(false, "Usuário não esta ativo, favor contate o administrador do sistema !");
                        } else {
                            return new Resultado(true, "Sessão válida !", sessao);
                        }
                    } else {
                        return new Resultado(false, "Sessão expirada.");
                    }
                }
            }
        }
    }
}
