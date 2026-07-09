using Microsoft.EntityFrameworkCore;
namespace HTT_QTHT.Models
{
    public class HTT_Context : DbContext
    {
        public HTT_Context(DbContextOptions<HTT_Context> options) : base(options) { }

        #region model        
        public DbSet<Meeting_Chat> Meeting_Chat { get; set; }
        public DbSet<Meeting_Conclusion> Meeting_Conclusion { get; set; }
        public DbSet<Meeting_Content> Meeting_Content { get; set; }
        public DbSet<Meeting_Document> Meeting_Document { get; set; }
        public DbSet<Meeting_Member> Meeting_Member { get; set; }
        public DbSet<Meeting_Option> Meeting_Option { get; set; }
        public DbSet<Meeting_Plan> Meeting_Plan { get; set; }
        public DbSet<Meeting_Schedule> Meeting_Schedule { get; set; }
        public DbSet<Meeting_Server> Meeting_Server { get; set; }
        public DbSet<Meeting_Type> Meeting_Type { get; set; }
        public DbSet<Meeting_Video> Meeting_Video { get; set; }
        public DbSet<Meeting_Voted> Meeting_Voted { get; set; }
        public DbSet<Meeting_Votes> Meeting_Votes { get; set; }
        public DbSet<Meeting_Whiteboard> Meeting_Whiteboard { get; set; }

        #endregion
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
