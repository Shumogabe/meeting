namespace HTT_QTHT.Api.Helpers
{
    public class Language
    {
        public string Lang { get; set; }
        public string LangUrl { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="url">Site url</param>
        /// <returns></returns>
        public static Language GetLang(string url)
        {
            Language language = new Language();
            try
            {
                string[] str = url.Split('/');
                language.LangUrl = !string.IsNullOrEmpty(str[3]) ? str[3] : "vi-vn";
                language.Lang = Language.GetShortLang(language.LangUrl);
            }
            catch
            {
            }
            return language;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="langurl">vi-vn</param>
        /// <returns></returns>
        public static string GetShortLang(string langurl)
        {
            try
            {
                if (string.IsNullOrEmpty(langurl)) return "vi";
                string[] str = langurl.Split('-');
                return str[0];
            }
            catch
            {
                return "vi";
            }

        }
        public static bool Validate(string array_lang, string lang)
        {
            if (string.IsNullOrEmpty(array_lang) || string.IsNullOrEmpty(lang)) return false;
            var array = array_lang.Split(';');
            int result = Array.IndexOf(array, lang);
            if (result > -1)
            {
                return true;
            }
            else return false;
        }
    }
}
