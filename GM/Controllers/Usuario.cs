using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace GM.Controllers {
    public class Usuario {
        public int codigo { get; set; }
        public String nome { get; set; }
        public String login { get; set; }
        public String senha { get; set; }
        public String banco { get; set; }
        public int permissao { get; set; }
        public int situacao { get; set; }

        private String ToMD5(String input) {
            MD5 md5Hask = MD5.Create();
            byte[] data = md5Hask.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for(int i = 0; i < data.Length; i++) {
                sBuilder.Append(data[i].ToString("X2"));
            }
            return sBuilder.ToString();
        }
    }
}
