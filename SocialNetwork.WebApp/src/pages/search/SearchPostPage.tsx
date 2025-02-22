import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PostResource } from "../../types/post";
import { Pagination } from "../../types/response";
import { inititalValues } from "../../utils/pagination";
import searchService from "../../services/searchService";
import { PostType } from "../../enums/post-type";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import SharePost from "../../components/posts/SharePost";
import PostGroup from "../../components/posts/PostGroup";
import Post from "../../components/posts/Post";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Filter, FilterX } from "lucide-react";
import SearchPostFilter, { SearchPostFilterParams } from "../../components/posts/SearchPostFilter";


const SearchPostPage: FC = ({
}) => {
    const [searchParam] = useSearchParams();
    const [posts, setPosts] = useState<PostResource[]>([]);
    const [pagination, setPagination] = useState<Pagination>(inititalValues);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [message, setMessage] = useState('');

    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState<SearchPostFilterParams>()


    const fetchPosts = async (value: string, page: number, size: number) => {
        setLoading(true)
        const response = await searchService.searchPosts(value, page, size, filter);
        setLoading(false)
        if (response.isSuccess) {
            setMessage(response.message)
            setPagination(response.pagination);

            if (page === 1) {
                setPosts(response.data);
            } else {
                setPosts(prevPosts => {
                    const existingIds = new Set(prevPosts.map(post => post.id));
                    const newPosts = response.data.filter(post => !existingIds.has(post.id));
                    return [...prevPosts, ...newPosts];
                });
            }
        }
    }

    const handleRemovePost = (postId: string) => {
        setPosts(prevPosts => [...prevPosts.filter(p => p.id !== postId)])
    }

    const fetchNewPosts = async () => {
        if (!pagination.hasMore || loading) return;
        fetchPosts(searchValue, pagination.page + 1, pagination.size);
    };

    useEffect(() => {
        const paramSearch = searchParam.get('q')
        if (paramSearch) {
            setSearchValue(paramSearch)
            fetchPosts(paramSearch, 1, 6)
        } else {
            fetchPosts(searchValue, 1, 6)
        }
    }, [searchParam, filter]);

    const { containerRef } = useInfiniteScroll({
        fetchMore: () => void fetchNewPosts(),
        hasMore: pagination.hasMore,
        loading,
        rootMargin: "50px",
        triggerId: "search-post-scroll-trigger",
    });

    return <div className="relative w-full h-full flex flex-col">
        <div className="sticky z-[70] top-0 bg-white p-4 shadow border-b-[1px] border-gray-100 flex items-center justify-between">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-1">
                    <Filter size={18} />
                    <span className="text-[16px] font-bold">Bộ lọc</span>
                </div>

            </div>

            <SearchPostFilter
                onChange={(filter) => {
                    setIsFilter(true);
                    setFilter(filter)
                }}
            />

            {isFilter && <button
                onClick={() => {
                    setFilter({
                        sortOrder: 'desc',
                        contentType: 'ALL',
                        fromDate: undefined,
                        toDate: undefined,
                    })
                    fetchPosts(searchValue, 1, 6)
                    setIsFilter(false)
                }}
                className="py-1 px-2 hover:bg-gray-200 rounded-md bg-gray-100 flex items-center gap-x-1">
                <FilterX size={18} />
                <span>Bỏ lọc</span>
            </button>}
        </div>
        <div className="flex flex-col gap-y-2 md:gap-y-6 max-w-screen-md h-full w-full mx-auto p-2 md:p-8 rounded-lg">
            <div ref={containerRef} className="flex flex-col gap-y-4 w-full h-full scrollbar-hide overflow-y-auto">
                {!loading && <div className="text-gray-500 md:text-[16px] mt-2 text-sm text-center">{message}</div>}

                {posts.map(post => {
                    if (post.postType === PostType.SHARE_POST) {
                        return <SharePost onRemovePost={handleRemovePost} key={post.id} post={post} />;
                    } else if (post.isGroupPost) {
                        return <PostGroup onRemovePost={handleRemovePost} key={post.id} post={post} />;
                    }

                    return <Post onRemovePost={handleRemovePost} key={post.id} post={post} />;
                })}

                {loading && <LoadingIndicator title="Đang tìm kiếm" />}
                <div id="search-post-scroll-trigger" className="w-full h-1" />
            </div>
        </div>
    </div>

};

export default SearchPostPage;

