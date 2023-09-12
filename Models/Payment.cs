namespace TurfTimeApi.Models{
  public class Payment{
    public int paymentId { get; set; }
    public int userId { get; set; }
    public int bookingId { get; set; }
    public int totalAmount { get; set; }
    public int advanceAmount { get; set; }
    public int balanceAmount { get; set; }
    public string paymentType { get; set; }
    public DateTime paymentDate { get; set; }
    public string virtualPaymentAddress { get; set; }
    public string cardHolderName { get; set; }
    public long cardNumber { get; set; }
    public string expiryDate { get; set; }
    public int cvv { get; set; }
  }
}
