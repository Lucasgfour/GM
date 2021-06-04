using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GM.Views {
    [Route("")]
    public class HomeController : Controller {
        public IActionResult Index() {
            return View("index");
        }

        [Route("/Home")]
        public IActionResult Home() {
            return View("home");
        }
    }
}
