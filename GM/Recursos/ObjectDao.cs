using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

namespace GM.Recursos
{
    public class ObjectDao<T> {

        private String primary;
        public Boolean AutoIncrement { get; set; }
        public String banco { get; private set; }

        public ObjectDao(String primary, bool AutoIncrement, String banco) {
            this.primary = primary;
            this.AutoIncrement = AutoIncrement;
            this.banco = banco;
        }

        public ObjectDao(String primary, bool AutoIncrement) {
            this.primary = primary;
            this.AutoIncrement = AutoIncrement;
            this.banco = "gm";
        }

        public ObjectDao() {
            this.primary = "codigo";
            this.AutoIncrement = true;
            this.banco = "gm";
        }

        public ObjectDao(String banco) {
            this.primary = "codigo";
            this.AutoIncrement = true;
            this.banco = banco;
        }

        public void setNullPrimary() {
            this.primary = "";
            this.AutoIncrement = false;
        }

        public Resultado consultar(Object pk) {
            Comando comando = new Comando("SELECT * FROM " + novaInstancia().GetType().Name.ToLower() + " WHERE " + this.primary + " = @" + this.primary, this.banco);
            comando.addParametro("@" + this.primary, pk);
            return comando.consultar<T>();
        }

        public Resultado consultar(String Strcomando) {
            Comando comando = new Comando(Strcomando, this.banco);
            return comando.consultar<T>();
        }

        public Resultado listar() {
            return listar("SELECT * FROM " + novaInstancia().GetType().Name.ToLower());
        }

        public Resultado listar(String Strcomando) {
            Comando comando = new Comando(Strcomando, this.banco);
            return comando.listar<T>();
        }

        public Resultado inserir(T Obj) {
            String StrComando = "INSERT INTO " + Obj.GetType().Name.ToLower();
            Comando comando = new Comando(StrComando, this.banco);

            String Campos = "(";
            String Parametros = "(";
            foreach(PropertyInfo campo in getCampos()) {
               if(!(campo.Name.ToLower().Equals(this.primary) && this.AutoIncrement)) {
                    Campos = Campos + campo.Name.ToLower() + ", ";
                    Parametros = Parametros + "@" + campo.Name.ToLower() + ", ";
                    comando.addParametro("@" + campo.Name.ToLower(), campo.GetValue(Obj));
                }
            }
            
            StrComando = StrComando + (Campos + ")").Replace(", )", ")") + " VALUES" + (Parametros + ")").Replace(", )", ")");
            comando.setComando(StrComando);
            return comando.executar();
        }

        public Resultado alterar(T obj) {
            String StrComando = "UPDATE " + obj.GetType().Name.ToLower() + " SET";
            Comando comando = new Comando(StrComando, this.banco);

            String Campos = " ";
            foreach (PropertyInfo campo in getCampos()) {
                if (!(campo.Name.ToLower().Equals(this.primary) && this.AutoIncrement)) {
                    Campos = Campos + campo.Name.ToLower() + " = @" + campo.Name.ToLower() + ", ";
                    comando.addParametro("@" + campo.Name.ToLower(), campo.GetValue(obj));
                }
            }

            StrComando = StrComando + (Campos + "WHERE").Replace(", WHERE", " WHERE ") + this.primary + " = @" + this.primary;
            comando.setComando(StrComando);
            comando.addParametro("@" + this.primary, obj.GetType().GetProperty(this.primary).GetValue(obj));
            return comando.executar();
        }

        public Resultado delete(T obj){
            return delete(obj.GetType().GetProperty(this.primary).GetValue(obj));
        }

        public Resultado delete(Object pk) {
            Comando comando = new Comando("DELETE FROM " + novaInstancia().GetType().Name.ToLower() + " WHERE " + this.primary + " = @" + this.primary, this.banco);
            comando.addParametro("@" + this.primary, pk);
            return comando.consultar<T>();
        }


        private T novaInstancia() {
            return (T)Activator.CreateInstance(typeof(T), new object[] { });
        }

        private PropertyInfo[] getCampos() {
            return novaInstancia().GetType().GetProperties();
        }
      
    }
}
