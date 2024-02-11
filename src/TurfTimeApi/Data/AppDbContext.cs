using Microsoft.EntityFrameworkCore;
using TurfTimeApi.Models;

namespace TurfTimeApi.Context{
    public class AppDbContext : DbContext{
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options){ }
        public DbSet<User> tbl_users { get; set; }
        public DbSet<Game> tbl_games { get; set; }
        public DbSet<BookingDetails> tbl_booking_details{ get; set; }
        public DbSet<TimeSlot> tbl_timeslot { get; set; }
        public DbSet<Payment> tbl_payment { get; set; }
        public DbSet<Feedback> tbl_feedback { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasMany( user => user.myBookings);
            modelBuilder.Entity<BookingDetails>()
                        .HasMany( booking => booking.timeSlots);
        }
    }
}
