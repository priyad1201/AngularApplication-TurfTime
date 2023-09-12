using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class BookedSlotController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookedSlotController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BookedSlot
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDetails>>> GetBookedSlot()
        {
          var bookedSlot = await _context.tbl_booking_details
                                        .Include(booking=>booking.timeSlots)
                                        .Where(booking => booking.paymentStatus=="paid").ToListAsync();
          if(bookedSlot == null){
            return NotFound();
          }
          return bookedSlot;
        }
        [HttpGet("{bookingId}")]
        public async Task<ActionResult<BookingDetails>> GetBookingDetails(int userId, int bookingId)
        {
            var user = await _context.tbl_users
                                    .Include(user => user.myBookings)
                                    .ThenInclude(booking => booking.timeSlots)
                                    .FirstOrDefaultAsync(user => user.userId == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }
            var bookingDetails = user.myBookings.FirstOrDefault(booking => booking.bookingId == bookingId);
            if (bookingDetails == null)
            {
                return NotFound("Booking details not found.");
            }
            return Ok(bookingDetails);
        }

        [HttpGet("checkAvailability")]
        public IActionResult CheckSlotAvailability(string venueName, string sportName, DateTime dateOfSlot)
        {
          var bookedSlots = _context.tbl_booking_details.Include(booking => booking.timeSlots)
                            .Where(slot => slot.venueName == venueName && slot.sportName == sportName && slot.dateOfSlot == dateOfSlot && slot.paymentStatus== "paid")
                            .SelectMany(slot => slot.timeSlots)
                            .ToList();
          return Ok(bookedSlots);
        }

        // DELETE: api/BookedSlot/5
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteBookedSlot(int id)
        // {
        //     var bookedSlot = await _context.tbl_booked_slot.FindAsync(id);
        //     if (bookedSlot == null)
        //     {
        //         return NotFound();
        //     }

        //     _context.tbl_booked_slot.Remove(bookedSlot);
        //     await _context.SaveChangesAsync();

        //     return NoContent();
        // }

    }
}
