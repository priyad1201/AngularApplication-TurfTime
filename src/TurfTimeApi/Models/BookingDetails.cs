using System.ComponentModel.DataAnnotations;

namespace TurfTimeApi.Models{

  public class BookingDetails{
    [Key]
    public int bookingId { get; set; }
    public string reservationId { get; set; }
    public string venueName { get; set; }
    public string sportName { get; set; }
    public string sportImageUrl { get; set; }
    public DateTime dateOfSlot { get; set; }
    public DateTime dateOfBooking { get; set; }
    public List<TimeSlot> timeSlots { get; set; }
    public int pricePerHour { get; set; }
    public int numberOfHours { get; set; }
    public int totalAmount { get; set; }
    public string paymentStatus { get; set; }
  }
  public class TimeSlot
  {
    [Key]
    public int id { get; set; }
    public string startTime { get; set; }
    public string endTime { get; set; }
  }
}
