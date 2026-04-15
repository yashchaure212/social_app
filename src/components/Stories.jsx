import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const stories = [
  { id: 1, username: "yash_dev" },
  { id: 2, username: "alex" },
  { id: 3, username: "john" },
  { id: 4, username: "react_guru" },
  { id: 5, username: "coder" },
  { id: 6, username: "design_pro" },
  { id: 7, username: "ui_master" },
  { id: 8, username: "frontend" },
  { id: 9, username: "yash_dev" },
  { id: 10, username: "alex" },
  { id: 11, username: "john" },
  { id: 12, username: "react_guru" },
  { id: 13, username: "coder" },
  { id: 14, username: "design_pro" },
  { id: 15, username: "ui_master" },
  { id: 16, username: "frontend" },
];

const Stories = () => {
  const scrollRef = useRef();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scroll = (direction) => {
    const amount = 250;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll();
  }, []);

  return (
    <div className="relative bg-white p-3 rounded-lg w-[calc(100%+100px)] -ml-15">
      {/* LEFT BUTTON */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1.5 rounded-full hover:scale-110 transition"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* RIGHT BUTTON */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1.5 rounded-full hover:scale-110 transition"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* STORIES SCROLL */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar px-8"
      >
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center min-w-17.5 cursor-pointer"
          >
            {/* Gradient Ring */}
            <div className="p-0.5 rounded-full bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="bg-white p-0.5 rounded-full">
                <img
                  src={`https://i.pravatar.cc/100?img=${story.id}`}
                  alt="story"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Username */}
            <p className="text-xs mt-1 truncate w-15 text-center">
              {story.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
