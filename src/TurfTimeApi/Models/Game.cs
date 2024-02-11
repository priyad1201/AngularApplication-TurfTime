using System.ComponentModel.DataAnnotations;

namespace TurfTimeApi.Models{
    public class Game{
        [Key]
        public int id { get; set; }
        public string sportName { get; set; }
        public string category { get; set; }
        public int priceForWeekday { get; set; }
        public int priceForWeekend { get; set; }
        public string venueName { get; set; }
        public string description { get; set; }
        public string imageUrl { get; set; }
    }
}
