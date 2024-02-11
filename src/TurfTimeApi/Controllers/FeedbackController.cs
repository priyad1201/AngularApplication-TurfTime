using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurfTimeApi.Context;
using TurfTimeApi.Models;

namespace TurfTimeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Feedback
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedback()
        {
            return await _context.tbl_feedback.ToListAsync();
        }

        // GET: api/Feedback/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetFeedback(int id)
        {
            var feedback = await _context.tbl_feedback.FindAsync(id);

            if (feedback == null)
            {
                return NotFound();
            }

            return feedback;
        }

        // PUT: api/Feedback/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFeedback(int id, Feedback feedback)
        {
            if (id != feedback.feedbackId)
            {
                return BadRequest();
            }
            _context.Entry(feedback).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // POST: api/Feedback
        [HttpPost]
        public async Task<ActionResult<Feedback>> PostFeedback(Feedback feedback)
        {
            _context.tbl_feedback.Add(feedback);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeedback", new { id = feedback.feedbackId }, feedback);
        }

        // DELETE: api/Feedback/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            var feedback = await _context.tbl_feedback.FindAsync(id);
            if (feedback == null)
            {
                return NotFound();
            }

            _context.tbl_feedback.Remove(feedback);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FeedbackExists(int id)
        {
            return _context.tbl_feedback.Any(feedback => feedback.feedbackId == id);
        }
    }
}
