'use client';

import { useState, useMemo } from "react";
import type { Film } from "@/lib/types";
import FilmCard from "./film-card";
import Filters from "./filters";

type FilmGridProps = {
  films: Film[];
  genres: string[];
  countries: string[];
};

export default function FilmGrid({ films, genres, countries }: FilmGridProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [selectedCountry, setSelectedCountry] = useState<string>("Todos");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");

  const filteredAndSortedFilms = useMemo(() => {
    let processedFilms = [...films];

    if (searchQuery) {
        processedFilms = processedFilms.filter((film) =>
            film.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (selectedGenre !== "Todos") {
      processedFilms = processedFilms.filter((film) => film.genero.includes(selectedGenre));
    }

    if (selectedCountry !== "Todos") {
        processedFilms = processedFilms.filter((film) => film.pais === selectedCountry);
    }

    if (yearFilter) {
        processedFilms = processedFilms.filter((film) =>
            film.año.toString() === yearFilter
        );
    }

    if (sortOrder === "newest") {
        processedFilms.sort((a, b) => b.año - a.año);
    } else if (sortOrder === "oldest") {
        processedFilms.sort((a, b) => a.año - b.año);
    }

    return processedFilms;
  }, [films, selectedGenre, selectedCountry, sortOrder, searchQuery, yearFilter]);

  return (
    <div>
      <Filters
        genres={genres}
        countries={countries}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
      />
      {filteredAndSortedFilms.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
          {filteredAndSortedFilms.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No se encontraron películas con esos filtros.</p>
        </div>
      )}
    </div>
  );
}
