using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class altervaitro20220619232901 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "last_time_sua",
                table: "vai_tro",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "last_time_sua",
                table: "vai_tro");
        }
    }
}
