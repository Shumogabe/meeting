using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class thay_doi_thong_tin_add_otp_id : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "otp_id",
                table: "thay_doi_thong_tin",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "otp_id",
                table: "thay_doi_thong_tin");
        }
    }
}
