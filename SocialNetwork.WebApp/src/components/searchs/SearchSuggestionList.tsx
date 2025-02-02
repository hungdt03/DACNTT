import { FC } from "react";
import SearchUserSuggestItem from "./suggest/SearchUserSuggestItem";
import SearchUserSuggestText from "./suggest/SearchUserSuggestText";
import { SearchAllSuggestResource } from "../../types/search/search-all-suggest";
import SearchGroupSuggestItem from "./suggest/SearchGroupSuggestItem";
import SearchGroupSuggestionText from "./suggest/SearchGroupSuggestText";

type SearchSuggestionListProps = {
    suggestion: SearchAllSuggestResource;
    isUserBefore: boolean;
}

const SearchSuggestionList: FC<SearchSuggestionListProps> = ({
    suggestion,
    isUserBefore
}) => {
    return <div className="flex flex-col gap-y-1">
        {suggestion.users.map(suggest => {
            if (suggest.isFriend)
                return <SearchUserSuggestItem key={suggest.user.id} user={suggest.user} />
            return <SearchUserSuggestText key={suggest.user.id} suggest={suggest} />
        })}

        {suggestion.groups.map(suggest => {
            if (suggest.isMember)
                return <SearchGroupSuggestItem key={suggest.group.id} group={suggest.group} />
            return <SearchGroupSuggestionText key={suggest.group.id} suggest={suggest}  />
        })}
    </div>

};

export default SearchSuggestionList;
