using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class cau_hinh_he_thong_add_thong_so : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "nhan_canh_bao",
                table: "cau_hinh_he_thong");

            migrationBuilder.RenameColumn(
                name: "email_nhan_canh_bao",
                table: "cau_hinh_he_thong",
                newName: "thong_so");

            migrationBuilder.AddColumn<long>(
                name: "last_time_sua",
                table: "cau_hinh_he_thong",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "last_time_sua",
                table: "cau_hinh_he_thong");

            migrationBuilder.RenameColumn(
                name: "thong_so",
                table: "cau_hinh_he_thong",
                newName: "email_nhan_canh_bao");

            migrationBuilder.AddColumn<int>(
                name: "nhan_canh_bao",
                table: "cau_hinh_he_thong",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
