namespace HTT_QTHT.Api.Helpers
{
    public static class ModuleHelper
    {
        public const string CATALOG = "Catalog";
        public const string ARTICLE = "Article";
        public const string FILE = "File";
        public const string SITE_LINK = "SiteLink";
        public const string LAW = "Law";
        public const string ORGANIZATION = "Organization";
        public const string PROJECT = "Project";
        public const string OPTION = "Option";
        public const string CONTENT = "Content";
        public const string CHAT = "Chat";
        public const string CONSLUSION = "Conslusion";
        public const string DOCUMENT = "Document";
        public const string MEMBER = "Member";
        public const string SCHEDULE = "Schedule";
        public const string SERVER = "Server";
        public const string TYPE = "Type";
        public const string VIDEO = "Video";
        public const string VOTED = "Voted";
        public const string VOTES = "Votes";
        public const string WHITEBOARD = "Whiteboard";
        public const string SENDMAIL = "SendMail";

        public const string SYSTEM_ADMIN = "SystemAdmin";
        public static bool Validate(string array_module, string module)
        {
            if (string.IsNullOrEmpty(array_module) || string.IsNullOrEmpty(module)) return false;
            var array = array_module.Split(';');
            int result = Array.IndexOf(array, module);
            if (result > -1)
            {
                return true;
            }
            else return false;
        }
    }
}
