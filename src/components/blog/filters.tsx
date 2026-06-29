'use client';

import { Input } from "@/components/ui/input";
import { Search, Tag, Calendar } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";

type FiltersProps = {
    tags: string[];
    selectedTag: string;
    onTagChange: (value: string) => void;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    selectedYear: string;
    onYearChange: (value: string) => void;
};

export default function Filters({ 
    tags,
    selectedTag,
    onTagChange,
    searchQuery,
    onSearchQueryChange,
    selectedYear,
    onYearChange,
}: FiltersProps) {
    const tagOptions = [
        { value: "Todos", label: "Todas las etiquetas" },
        ...tags.map(tag => ({ value: tag, label: tag }))
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative w-full md:flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar por título..." 
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-[150px]">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="number"
                        placeholder="Año"
                        className="pl-10 w-full"
                        value={selectedYear}
                        onChange={(e) => onYearChange(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <Combobox
                        options={tagOptions}
                        value={selectedTag}
                        onValueChange={onTagChange}
                        placeholder="Etiquetas"
                        emptyMessage="No se encontró la etiqueta."
                        searchPlaceholder="Buscar etiqueta..."
                        className="w-full sm:w-[240px]"
                        icon={<Tag className="mr-2 h-4 w-4" />}
                    />
                </div>
            </div>
        </div>
    );
}
