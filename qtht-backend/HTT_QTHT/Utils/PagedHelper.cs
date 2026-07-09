namespace HTT_QTHT.Api.Utils
{
    public class PagedModel<T>
    {
        public Pagination pagination;

        public List<T> data { get; set; }
    }

    public class Pagination
    {
        public int firstPage { get; set; }
        public int lastPage { get; set; }
        public int prevPage { get; set; }
        public int nextPage { get; set; }
        public int total { get; set; }
        public int currentPage { get; set; }

    }

    public class PagedHelper<T>
    {
        public PagedModel<T> Paged<T>(IQueryable<T> query, int page, int size)
        {
            if (page == null || page <= 0)
            {
                var entries = query.ToList();
                var model = new PagedModel<T>();
                var count = query.Count();
                var totalPages = (int)Math.Ceiling(count / (float)size);
                Pagination pagination = new Pagination();
                pagination.firstPage = 1; // obviously
                pagination.lastPage = 1;
                pagination.prevPage = 1;
                pagination.nextPage = 1;
                pagination.total = count;
                pagination.currentPage = 1;
                model.data = entries;
                model.pagination = pagination;
                return model;
            }
            else
            {
                var entries = query.Skip((page - 1) * size).Take(size).ToList();
                var model = new PagedModel<T>();
                var count = query.Count();
                var totalPages = (int)Math.Ceiling(count / (float)size);
                Pagination pagination = new Pagination();
                pagination.firstPage = 1; // obviously
                pagination.lastPage = totalPages;
                pagination.prevPage = page > pagination.firstPage ? page - 1 : pagination.firstPage;
                pagination.nextPage = page < pagination.lastPage ? page + 1 : pagination.lastPage;
                pagination.total = query.Count();
                pagination.currentPage = page;
                model.pagination = pagination;
                model.data = entries;
                return model;
            }
        }
    }

}



