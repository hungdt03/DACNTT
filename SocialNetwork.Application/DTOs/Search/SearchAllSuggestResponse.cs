

namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchAllSuggestResponse
    {
        public List<SearchUserSuggestResponse> Users { get; set; }
        public List<SearchGroupSuggestResponse> Groups { get; set; }
    }
}
