using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GM.Controllers {
    public class Sessao {
        public String chave { get; set; }
        public DateTime horario { get; set; }
        public int usuario { get; set; }
        private Usuario user { get; set; }
        public int ativa { get; set; }

        public Usuario getUsuario() {
            return this.user;
        }

        public void setUsuario(Usuario a) {
            this.user = a;
        }
    }
}
