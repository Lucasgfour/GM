using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GM.Controllers {
    public class Caixa {
        public int codigo { get; set; }
        public DateTime dtcaixa { get; set; }
        public String descricao { get; set; }
        public int tipo { get; set; }
        public Decimal valor{ get; set; }
    }
}
