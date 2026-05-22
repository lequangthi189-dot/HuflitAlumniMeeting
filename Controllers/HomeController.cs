using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using HuflitAlumniMeeting.Models;

namespace HuflitAlumniMeeting.Controllers;

public class HomeController : Controller
{

    public IActionResult Index()
    {
        return View();
    }
    [HttpGet]
    public ViewResult Form()
    {
        return View();
    }
    [HttpPost]
    public ViewResult RsvpForm(Guests guest)
    { // TODO: store response from guest 
        Repository.AddResponse(guest);
        return View("Thanks", guest);
    }
    public ViewResult ListResponses()
    {
        return View(Repository.Responses.Where(r => r.WillAttend == true));
    }


}
