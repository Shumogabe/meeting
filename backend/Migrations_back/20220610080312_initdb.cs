using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace QTHT.Api.Migrations
{
    public partial class initdb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "canh_bao_dang_nhap",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false),
                    cau_hinh_canh_bao_id = table.Column<long>(type: "bigint", nullable: false),
                    noi_dung = table.Column<string>(type: "text", nullable: true),
                    trang_thai_doc = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_canh_bao_dang_nhap", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "cau_hinh_canh_bao",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    loai = table.Column<string>(type: "text", nullable: true),
                    so_lan_login = table.Column<int>(type: "integer", nullable: false),
                    so_lan_sai_pass = table.Column<int>(type: "integer", nullable: false),
                    ip_nuoc_ngoai_ds = table.Column<string>(type: "text", nullable: true),
                    kich_hoat = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cau_hinh_canh_bao", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "cau_hinh_he_thong",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nhan_canh_bao = table.Column<int>(type: "integer", nullable: false),
                    email_nhan_canh_bao = table.Column<string>(type: "text", nullable: true),
                    su_dung = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cau_hinh_he_thong", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "chuc_vu",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    ma = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chuc_vu", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "don_vi",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    parent_id = table.Column<long>(type: "bigint", nullable: false),
                    ten = table.Column<string>(type: "text", nullable: true),
                    ad_thu_muc = table.Column<string>(type: "text", nullable: true),
                    da_xoa = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_don_vi", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "email",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email_nhan = table.Column<string>(type: "text", nullable: true),
                    hoat_dong = table.Column<string>(type: "text", nullable: true),
                    noi_dung = table.Column<string>(type: "text", nullable: true),
                    trang_thai_gui = table.Column<int>(type: "integer", nullable: false),
                    lan_gui = table.Column<int>(type: "integer", nullable: false),
                    loi = table.Column<string>(type: "text", nullable: true),
                    time_gui = table.Column<long>(type: "bigint", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_email", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "he_thong_dinh_danh",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    url = table.Column<string>(type: "text", nullable: true),
                    domain = table.Column<string>(type: "text", nullable: true),
                    default_ou = table.Column<string>(type: "text", nullable: true),
                    default_root_ou = table.Column<string>(type: "text", nullable: true),
                    service_user = table.Column<string>(type: "text", nullable: true),
                    service_password = table.Column<string>(type: "text", nullable: true),
                    kich_hoat = table.Column<int>(type: "integer", nullable: false),
                    da_xoa = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_he_thong_dinh_danh", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "he_thong_sms",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    thong_tin = table.Column<string>(type: "text", nullable: true),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_he_thong_sms", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "khoi_phuc_mat_khau",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "text", nullable: true),
                    otp_id = table.Column<long>(type: "bigint", nullable: false),
                    ma_bao_ve = table.Column<string>(type: "text", nullable: true),
                    trang_thai = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_khoi_phuc_mat_khau", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "log",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false),
                    doi_tuong = table.Column<int>(type: "integer", nullable: false),
                    chuc_nang = table.Column<string>(type: "text", nullable: true),
                    thao_tac = table.Column<string>(type: "text", nullable: true),
                    noi_dung = table.Column<string>(type: "text", nullable: true),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_log", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "otp",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    table = table.Column<string>(type: "text", nullable: true),
                    table_id = table.Column<long>(type: "bigint", nullable: false),
                    ma = table.Column<string>(type: "text", nullable: true),
                    lan_nhap = table.Column<int>(type: "integer", nullable: false),
                    trang_thai_kich_hoat = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_otp", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "quyen",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    ma = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    chuc_nang = table.Column<string>(type: "text", nullable: true),
                    thao_tac = table.Column<string>(type: "text", nullable: true),
                    da_xoa = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_quyen", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "quyen_vai_tro",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    quyen_id = table.Column<long>(type: "bigint", nullable: false),
                    vai_tro_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_quyen_vai_tro", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sms",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    mobile_nhan = table.Column<string>(type: "text", nullable: true),
                    hoat_dong = table.Column<string>(type: "text", nullable: true),
                    noi_dung = table.Column<string>(type: "text", nullable: true),
                    trang_thai_gui = table.Column<int>(type: "integer", nullable: false),
                    lan_gui = table.Column<int>(type: "integer", nullable: false),
                    loi = table.Column<string>(type: "text", nullable: true),
                    time_gui = table.Column<long>(type: "bigint", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sms", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tai_khoan",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ho_ten = table.Column<string>(type: "text", nullable: true),
                    don_vi_id = table.Column<long>(type: "bigint", nullable: false),
                    chuc_vu_id = table.Column<long>(type: "bigint", nullable: false),
                    mobile = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    trang_thai_kich_hoat = table.Column<string>(type: "text", nullable: true),
                    trang_thai_chan = table.Column<string>(type: "text", nullable: true),
                    ad_trang_thai_tao = table.Column<string>(type: "text", nullable: true),
                    ad_user_name = table.Column<string>(type: "text", nullable: true),
                    da_xoa = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tai_khoan", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tai_khoan_quyen",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    quyen_id = table.Column<long>(type: "bigint", nullable: false),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tai_khoan_quyen", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tai_khoan_vai_tro",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false),
                    vai_tro_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tai_khoan_vai_tro", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "thay_doi_mat_khau",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false),
                    otp_id = table.Column<long>(type: "bigint", nullable: false),
                    trang_thai = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_thay_doi_mat_khau", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "thay_doi_thong_tin",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tai_khoan_id = table.Column<long>(type: "bigint", nullable: false),
                    trang_thai = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_thay_doi_thong_tin", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "thiet_bi_sms",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    thong_tin = table.Column<string>(type: "text", nullable: true),
                    time_tao = table.Column<long>(type: "bigint", nullable: false),
                    last_time_sua = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_thiet_bi_sms", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vai_tro",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ten = table.Column<string>(type: "text", nullable: true),
                    ma = table.Column<string>(type: "text", nullable: true),
                    mo_ta = table.Column<string>(type: "text", nullable: true),
                    da_xoa = table.Column<int>(type: "integer", nullable: false),
                    time_tao = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vai_tro", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "canh_bao_dang_nhap");

            migrationBuilder.DropTable(
                name: "cau_hinh_canh_bao");

            migrationBuilder.DropTable(
                name: "cau_hinh_he_thong");

            migrationBuilder.DropTable(
                name: "chuc_vu");

            migrationBuilder.DropTable(
                name: "don_vi");

            migrationBuilder.DropTable(
                name: "email");

            migrationBuilder.DropTable(
                name: "he_thong_dinh_danh");

            migrationBuilder.DropTable(
                name: "he_thong_sms");

            migrationBuilder.DropTable(
                name: "khoi_phuc_mat_khau");

            migrationBuilder.DropTable(
                name: "log");

            migrationBuilder.DropTable(
                name: "otp");

            migrationBuilder.DropTable(
                name: "quyen");

            migrationBuilder.DropTable(
                name: "quyen_vai_tro");

            migrationBuilder.DropTable(
                name: "sms");

            migrationBuilder.DropTable(
                name: "tai_khoan");

            migrationBuilder.DropTable(
                name: "tai_khoan_quyen");

            migrationBuilder.DropTable(
                name: "tai_khoan_vai_tro");

            migrationBuilder.DropTable(
                name: "thay_doi_mat_khau");

            migrationBuilder.DropTable(
                name: "thay_doi_thong_tin");

            migrationBuilder.DropTable(
                name: "thiet_bi_sms");

            migrationBuilder.DropTable(
                name: "vai_tro");
        }
    }
}
