using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class update_tai_khoan_add_column : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ad_trang_thai_tao",
                table: "tai_khoan",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "trang_thai_chan",
                table: "tai_khoan",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "trang_thai_kich_hoat",
                table: "tai_khoan",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ad_trang_thai_tao",
                table: "tai_khoan");

            migrationBuilder.DropColumn(
                name: "trang_thai_chan",
                table: "tai_khoan");

            migrationBuilder.DropColumn(
                name: "trang_thai_kich_hoat",
                table: "tai_khoan");
        }
    }
}
