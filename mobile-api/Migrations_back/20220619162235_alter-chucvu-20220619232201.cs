using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class alterchucvu20220619232201 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "da_xoa",
                table: "chuc_vu",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "last_time_sua",
                table: "chuc_vu",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "da_xoa",
                table: "chuc_vu");

            migrationBuilder.DropColumn(
                name: "last_time_sua",
                table: "chuc_vu");
        }
    }
}
