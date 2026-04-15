import React from "react";

const suggestedUsers = [
  {
    id: 1,
    username: "alex_dev",
    bio: "Follows you",
  },
  {
    id: 2,
    username: "john_smith",
    bio: "New to Instagram",
  },
  {
    id: 3,
    username: "react_master",
    bio: "Suggested for you",
  },
];

const RightSidebar = () => {
  return (
    <div>

      {/* Current User */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
            alt="user"
          />
          <div>
            <p className="font-semibold text-sm">yash_dev</p>
            <p className="text-gray-500 text-xs">Yash</p>
          </div>
        </div>
        <button className="text-blue-500 text-xs font-semibold">
          Switch
        </button>
      </div>

      {/* Suggested Section */}
      <div className="flex justify-between mb-4">
        <p className="text-gray-500 text-sm font-semibold">
          Suggested for you
        </p>
        <button className="text-xs font-semibold">See All</button>
      </div>

      {/* Suggested Users List */}
      <div className="flex flex-col gap-4">
        {suggestedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://i.pravatar.cc/40?img=${user.id}`}
                className="w-8 h-8 rounded-full"
                alt="user"
              />
              <div>
                <p className="text-sm font-semibold">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user.bio}
                </p>
              </div>
            </div>

            <button className="text-blue-500 text-xs font-semibold">
              Follow
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RightSidebar;