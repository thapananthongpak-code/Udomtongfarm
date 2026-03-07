// src/store/useSpecies.ts
import { useSpeciesStore } from "./speciesStore";

export function useSpecies() {
  const items = useSpeciesStore((s) => s.items);
  const updatedAt = useSpeciesStore((s) => s.updatedAt);

  const setItems = useSpeciesStore((s) => s.setItems);
  const add = useSpeciesStore((s) => s.add);
  const update = useSpeciesStore((s) => s.update);
  const remove = useSpeciesStore((s) => s.remove);

  return { items, updatedAt, setItems, add, update, remove };
}