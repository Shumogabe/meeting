using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class add_tb_dang_ky_tai_khoan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dang_ky_tai_khoan",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    thong_tin = table.Column<string>(type: "text", nullable: true),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false),
                    trang_thai_duyet = table.Column<int>(type: "integer", nullable: false),
                    ma_bao_ve = table.Column<string>(type: "text", nullable: true),
                    otp_id = table.Column<long>(type: "bigint", nullable: false),
                    da_xoa = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dang_ky_tai_khoan", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dang_ky_tai_khoan");
        }
    }
}
