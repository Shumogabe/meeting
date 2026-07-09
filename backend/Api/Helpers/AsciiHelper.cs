using System.Collections.Generic;

namespace HTT.Api.Helpers
{
    public class AsciiHelper
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public static string Decode(string value)
        {
            List<AsciiHelper> items = new List<AsciiHelper>();
            var item1 = new AsciiHelper { Key = "&#x002F;", Value = "/" };
            var item2 = new AsciiHelper { Key = "&#40;", Value = "(" };
            var item3 = new AsciiHelper { Key = "&#41;", Value = ")" };
            var item4 = new AsciiHelper { Key = "&#039;", Value = "'" };

            items.Add(item1);
            items.Add(item2);
            items.Add(item3);
            items.Add(item4);
            foreach (var item in items)
            {
                value.Replace(item.Key, item.Value);
            }
            return value;
        }
    }
}
