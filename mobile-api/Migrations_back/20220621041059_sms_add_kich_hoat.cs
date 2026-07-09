using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class sms_add_kich_hoat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "da_xoa",
                table: "thiet_bi_sms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "kich_hoat",
                table: "thiet_bi_sms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "da_xoa",
                table: "he_thong_sms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "kich_hoat",
                table: "he_thong_sms",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "da_xoa",
                table: "thiet_bi_sms");

            migrationBuilder.DropColumn(
                name: "kich_hoat",
                table: "thiet_bi_sms");

            migrationBuilder.DropColumn(
                name: "da_xoa",
                table: "he_thong_sms");

            migrationBuilder.DropColumn(
                name: "kich_hoat",
                table: "he_thong_sms");
        }
    }
}
