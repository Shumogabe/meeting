using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class update_bo_sung_don_vi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dia_chi",
                table: "don_vi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dien_thoai",
                table: "don_vi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "don_vi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "fax",
                table: "don_vi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "nguoi_dai_dien",
                table: "don_vi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "website",
                table: "don_vi",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dia_chi",
                table: "don_vi");

            migrationBuilder.DropColumn(
                name: "dien_thoai",
                table: "don_vi");

            migrationBuilder.DropColumn(
                name: "email",
                table: "don_vi");

            migrationBuilder.DropColumn(
                name: "fax",
                table: "don_vi");

            migrationBuilder.DropColumn(
                name: "nguoi_dai_dien",
                table: "don_vi");

            migrationBuilder.DropColumn(
                name: "website",
                table: "don_vi");
        }
    }
}
