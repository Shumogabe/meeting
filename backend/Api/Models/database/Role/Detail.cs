namespace HTT.Api.Models
{
    public class RoleDetail
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
    }
    public class UserRole:RoleDetail
    {        
        public bool Set { get; set; }
        public string Icon { get; set; }
    }
}
