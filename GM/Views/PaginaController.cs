using GM.Recursos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Reflection;

namespace GM.Views {

    [Route("API/[controller]")]
    public class PaginaController : ControllerBase {

        [HttpPost]
        public String GetPagina([FromBody] Pedido req) {
            Resultado sessaoAberta = req.GetSessao();
            if(!sessaoAberta.condicao) {
                sessaoAberta.resultado = req;
                return JsonConvert.SerializeObject(sessaoAberta);
            } else {
                try {
                    String path = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"Views\Paginas\" + req.solicitacao.ToString() + ".html");
                    String arquivo = System.IO.File.ReadAllText(path, System.Text.Encoding.Default);
                    return JsonConvert.SerializeObject(new Resultado(true, "Página OK", arquivo));
                } catch(Exception eGet) {
                    Console.WriteLine(eGet.ToString());
                    return JsonConvert.SerializeObject(new Resultado(false, "Erro ná página : " + eGet.Message));
                }
            }
        }
    }
}
