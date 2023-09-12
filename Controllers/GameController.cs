using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurfTimeApi.Context;
using TurfTimeApi.Models;

namespace TurfTimeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public GameController(AppDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }
        // GET: api/Game
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGame()
        {
            return await _context.tbl_games.ToListAsync();
        }

        // GET: api/Game/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGameById(int id)
        {
            var game = await _context.tbl_games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            return game;
        }

        [HttpGet("sportName")]
        public async Task<ActionResult<Game>> GetGameByName(string sportName)
        {
            var game = await _context.tbl_games.FirstOrDefaultAsync(game => game.sportName == sportName);
            if (game == null)
            {
                return NotFound();
            }
            return game;
        }
        [HttpGet("venueName")]
        public async Task<ActionResult<List<Game>>> GetSportAvailableInVenueAsync(string venueName)
        {
          var gamesList = await _context.tbl_games.Where(game => game.venueName == venueName).ToListAsync();
          return gamesList;
        }

        // [HttpGet("sport/{name}")]
        // public async Task<ActionResult<string>> GetSportName(string name)
        // {
        //     var game = await _context.tbl_games.FirstOrDefaultAsync(sport => sport.Name == name);
        //     if (game == null)
        //     {
        //         return NotFound();
        //     }
        //     return game.Name;
        // }

        // PUT: api/Game/5
        [HttpPut("{id}")]
        public async Task<ActionResult<GameReference>> PutGame(int id, [FromForm] GameReference reference)
        {
          var gameDetails = _context.tbl_games.FirstOrDefault(game=>game.id == id);
          gameDetails.sportName = reference.sportName;
          gameDetails.category =  reference.category;
          gameDetails.priceForWeekday = reference.priceForWeekday;
          gameDetails.priceForWeekend  = reference.priceForWeekend;
          gameDetails.venueName = reference.venueName;
          gameDetails.description = reference.description;
          if(reference.image != null)
          {
              gameDetails.imageUrl = await SaveImage(reference.image);
          }
          _context.tbl_games.Update(gameDetails);
          await _context.SaveChangesAsync();
          // try
          // {
          //     await _context.SaveChangesAsync();
          // }
          // catch (DbUpdateConcurrencyException)
          // {
          //     if (!GameExists(id))
          //     {
          //         return NotFound();
          //     }
          //     else
          //     {
          //         throw;
          //     }
          // }

          return NoContent();
        }

        [Authorize(Roles ="Admin")]
        // POST: api/Game
        [HttpPost]
        public async Task<ActionResult<Game>> PostGame([FromForm] GameReference reference)
        {
            var game = new Game
            {
                sportName = reference.sportName,
                category =  reference.category,
                priceForWeekday = reference.priceForWeekday,
                priceForWeekend  = reference.priceForWeekend,
                venueName = reference.venueName,
                description = reference.description
            };
            if(reference.image != null)
            {
                game.imageUrl = await SaveImage(reference.image);
            }
            _context.tbl_games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGame", new { id = game.id }, game);
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            var fileName = Path.GetFileName(image.FileName);
            var pathToUploadImage = Path.Combine(_webHostEnvironment.WebRootPath, "GameImage");

            if (!Directory.Exists(pathToUploadImage))
            {
                Directory.CreateDirectory(pathToUploadImage);
            }

            var filePath = Path.Combine(pathToUploadImage, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            return fileName;
        }

        [HttpGet("search")]
        public IActionResult SearchProducts(string sportName)
        {
            if (string.IsNullOrEmpty(sportName))
            {
                return BadRequest("Please provide the data you want search");
            }

            var gamesList =  _context.tbl_games.ToList()
                            .Where(game => game.sportName.Contains(sportName, StringComparison.OrdinalIgnoreCase))
                            .ToList();

            if (gamesList.Count == 0)
            {
                return NotFound("No products found .");
            }
            return Ok(gamesList);
        }

        [Authorize(Roles ="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            var game = await _context.tbl_games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            _context.tbl_games.Remove(game);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameExists(int id)
        {
            return _context.tbl_games.Any(game => game.id == id);
        }
    }
}
