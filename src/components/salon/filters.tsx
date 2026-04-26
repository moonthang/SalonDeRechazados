'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays, Globe, Search, Tag } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";

type FiltersProps = {
    genres: string[];
    countries: string[];
    selectedGenre: string;
    onGenreChange: (value: string) => void;
    selectedCountry: string;
    onCountryChange: (value: string) => void;
    sortOrder: string;
    onSortOrderChange: (value: string) => void;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    yearFilter: string;
    onYearChange: (value: string) => void;
};

export default function Filters({ 
    genres, 
    countries, 
    selectedGenre, 
    onGenreChange, 
    selectedCountry, 
    onCountryChange,
    sortOrder,
    onSortOrderChange,
    searchQuery,
    onSearchQueryChange,
    yearFilter,
    onYearChange,
}: FiltersProps) {
    const genreOptions = [
        { value: "Todos", label: "Todos los géneros" },
        ...genres.map(genre => ({ value: genre, label: genre }))
    ];

    const countryOptions = [
        { value: "Todos", label: "Todos los países" },
        ...countries.map(country => ({ value: country, label: country }))
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center">
            <div className="relative w-full lg:w-auto lg:flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar por título..." 
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:w-auto gap-4 w-full">
                <Combobox
                    options={genreOptions}
                    value={selectedGenre}
                    onValueChange={onGenreChange}
                    placeholder="Género"
                    emptyMessage="No se encontró el género."
                    searchPlaceholder="Buscar género..."
                    className="w-full lg:w-[200px]"
                    icon={<Tag className="mr-2 h-4 w-4" />}
                />
                <Combobox
                    options={countryOptions}
                    value={selectedCountry}
                    onValueChange={onCountryChange}
                    placeholder="País"
                    emptyMessage="No se encontró el país."
                    searchPlaceholder="Buscar país..."
                    className="w-full lg:w-[200px]"
                    icon={<Globe className="mr-2 h-4 w-4" />}
                />
                <div className="relative w-full lg:w-[180px]">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="number"
                        placeholder="Año"
                        className="pl-10 w-full"
                        value={yearFilter}
                        onChange={(e) => onYearChange(e.target.value)}
                    />
                </div>
                <Select value={sortOrder} onValueChange={onSortOrderChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Más recientes</SelectItem>
                        <SelectItem value="oldest">Más antiguas</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
