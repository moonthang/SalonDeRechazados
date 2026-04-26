'use client';

import { useState, useMemo } from "react";
import type { Post } from "@/lib/types";
import PostCard from "./post-card";
import Filters from "./filters";

type BitacoraContentProps = {
  posts: Post[];
  tags: string[];
};

export default function BitacoraContent({ posts, tags }: BitacoraContentProps) {
  const [selectedTag, setSelectedTag] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    let processedPosts = [...posts];

    if (searchQuery) {
        processedPosts = processedPosts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (selectedTag !== "Todos") {
        processedPosts = processedPosts.filter((post) => post.tags?.includes(selectedTag));
    }

    return processedPosts;
  }, [posts, selectedTag, searchQuery]);

  return (
    <div>
      <Filters
        tags={tags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No se encontraron entradas con esos filtros.</p>
        </div>
      )}
    </div>
  );
}