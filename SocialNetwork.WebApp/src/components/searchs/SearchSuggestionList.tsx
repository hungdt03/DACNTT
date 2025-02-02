import { FC } from "react";
import SearchUserSuggestItem from "./suggest/SearchUserSuggestItem";
import SearchUserSuggestText from "./suggest/SearchUserSuggestText";
import { SearchAllSuggestResource } from "../../types/search/search-all-suggest";
import SearchGroupSuggestItem from "./suggest/SearchGroupSuggestItem";
import SearchGroupSuggestionText from "./suggest/SearchGroupSuggestText";

type SearchSuggestionListProps = {
    suggestion: SearchAllSuggestResource;
    isUserBefore: boolean;
    searchValue: string;
}

const SearchSuggestionList: FC<SearchSuggestionListProps> = ({
    suggestion,
    isUserBefore,
    searchValue
}) => {
    return <div className="flex flex-col gap-y-1">
        {suggestion.users.map(suggest => {
            if (suggest.isFriend)
                return <SearchUserSuggestItem key={suggest.user.id} suggest={suggest} />
            return <SearchUserSuggestText key={suggest.user.id} searchValue={searchValue} suggest={suggest} />
        })}
        {suggestion.groups.map(suggest => {
            if (suggest.isMember)
                return <SearchGroupSuggestItem key={suggest.group.id} suggest={suggest} />
            return <SearchGroupSuggestionText searchValue={searchValue} key={suggest.group.id} suggest={suggest} />
        })}

    </div>

};

export default SearchSuggestionList;
