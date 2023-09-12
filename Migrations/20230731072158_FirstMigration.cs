using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TurfTimeApi.Migrations
{
    public partial class FirstMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_feedback",
                columns: table => new
                {
                    feedbackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    fullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    emailId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    feedbackDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ratings = table.Column<int>(type: "int", nullable: false),
                    comments = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_feedback", x => x.feedbackId);
                });

            migrationBuilder.CreateTable(
                name: "tbl_games",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    category = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    priceForWeekday = table.Column<int>(type: "int", nullable: false),
                    priceForWeekend = table.Column<int>(type: "int", nullable: false),
                    venueName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    imageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_games", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_payment",
                columns: table => new
                {
                    paymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    bookingId = table.Column<int>(type: "int", nullable: false),
                    totalAmount = table.Column<int>(type: "int", nullable: false),
                    advanceAmount = table.Column<int>(type: "int", nullable: false),
                    balanceAmount = table.Column<int>(type: "int", nullable: false),
                    paymentType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    paymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    virtualPaymentAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cardHolderName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cardNumber = table.Column<long>(type: "bigint", nullable: false),
                    expiryDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cvv = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_payment", x => x.paymentId);
                });

            migrationBuilder.CreateTable(
                name: "tbl_users",
                columns: table => new
                {
                    userId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    emailId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    mobileNumber = table.Column<long>(type: "bigint", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_users", x => x.userId);
                });

            migrationBuilder.CreateTable(
                name: "tbl_booking_details",
                columns: table => new
                {
                    bookingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    reservationId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    venueName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sportImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dateOfSlot = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dateOfBooking = table.Column<DateTime>(type: "datetime2", nullable: false),
                    pricePerHour = table.Column<int>(type: "int", nullable: false),
                    numberOfHours = table.Column<int>(type: "int", nullable: false),
                    totalAmount = table.Column<int>(type: "int", nullable: false),
                    paymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    userId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_booking_details", x => x.bookingId);
                    table.ForeignKey(
                        name: "FK_tbl_booking_details_tbl_users_userId",
                        column: x => x.userId,
                        principalTable: "tbl_users",
                        principalColumn: "userId");
                });

            migrationBuilder.CreateTable(
                name: "tbl_timeslot",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    startTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    endTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BookingDetailsbookingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_timeslot", x => x.id);
                    table.ForeignKey(
                        name: "FK_tbl_timeslot_tbl_booking_details_BookingDetailsbookingId",
                        column: x => x.BookingDetailsbookingId,
                        principalTable: "tbl_booking_details",
                        principalColumn: "bookingId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_booking_details_userId",
                table: "tbl_booking_details",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_timeslot_BookingDetailsbookingId",
                table: "tbl_timeslot",
                column: "BookingDetailsbookingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_feedback");

            migrationBuilder.DropTable(
                name: "tbl_games");

            migrationBuilder.DropTable(
                name: "tbl_payment");

            migrationBuilder.DropTable(
                name: "tbl_timeslot");

            migrationBuilder.DropTable(
                name: "tbl_booking_details");

            migrationBuilder.DropTable(
                name: "tbl_users");
        }
    }
}
