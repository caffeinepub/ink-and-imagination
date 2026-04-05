import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Manga } from "../backend";
import { useActor } from "./useActor";

export function useListAllManga() {
  const { actor, isFetching } = useActor();
  return useQuery<Manga[]>({
    queryKey: ["manga", "list"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllManga();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetMangaById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Manga | null>({
    queryKey: ["manga", id],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMangaById(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddManga() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (manga: Manga) => {
      if (!actor) throw new Error("No actor");
      await actor.addManga(manga);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
    },
  });
}

export function useUpdateManga() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (manga: Manga) => {
      if (!actor) throw new Error("No actor");
      await actor.updateManga(manga);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
    },
  });
}

export function useDeleteManga() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteManga(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
    },
  });
}

export function useClearAllManga() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.clearAllManga();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
    },
  });
}
