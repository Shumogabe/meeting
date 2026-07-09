using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class cau_hinh_canh_bao_add_khung_gio_ds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "khung_gio_dac_biet_ds",
                table: "cau_hinh_canh_bao",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "khung_gio_dac_biet_ds",
                table: "cau_hinh_canh_bao");
        }
    }
}
