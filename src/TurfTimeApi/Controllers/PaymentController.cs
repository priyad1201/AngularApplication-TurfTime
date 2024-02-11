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
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Payment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAllPayment()
        {
            return await _context.tbl_payment.ToListAsync();
        }

        // GET: api/Payment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPaymentById(int id)
        {
            var payment = await _context.tbl_payment.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // PUT: api/Payment/5
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutPayment(int id, Payment payment)
        // {
        //     if (id != payment.paymentId)
        //     {
        //         return BadRequest();
        //     }

        //     _context.Entry(payment).State = EntityState.Modified;

        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (!PaymentExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }
        //     return NoContent();
        // }

        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            _context.tbl_payment.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.paymentId }, payment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.tbl_payment.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.tbl_payment.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.tbl_payment.Any(payment => payment.paymentId == id);
        }
    }
}
