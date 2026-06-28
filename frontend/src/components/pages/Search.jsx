import { Search as SearchIcon, UserRound } from "lucide-react";
import { searchUsersThunk } from "@/redux/slices/userSlices";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults, loadingSearch } = useSelector((state) => state.user);

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchUsersThunk(query));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>

        <p className="text-muted-foreground mt-1">Discover people on VYRA</p>
      </div>

      {/* Search Bar */}
      <div className="sticky top-4 z-20 mb-8">
        <div className="bg-card/70 border-border flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl">
          <SearchIcon className="text-muted-foreground h-5 w-5" />

          <input
            value={query}
            onChange={handleSearch}
            placeholder="Search username..."
            className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Loading */}
      {loadingSearch && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-muted h-20 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      )}

      {/* Results */}
      {!loadingSearch && searchResults?.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/profile/${user._id}`)}
              className="group bg-card border-border hover:shadow-primary/5 hover:border-primary/20 cursor-pointer rounded-3xl border p-4 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    user.profilePicture ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  alt="profile"
                  className="h-14 w-14 rounded-full border object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground truncate font-semibold">
                    {user.username}
                  </h3>

                  <p className="text-muted-foreground truncate text-sm">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingSearch && query && searchResults?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-primary/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <UserRound className="text-primary h-10 w-10" />
          </div>

          <h3 className="text-lg font-semibold">No users found</h3>

          <p className="text-muted-foreground mt-1 text-sm">
            Try searching with a different username
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
