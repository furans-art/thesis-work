import { useQuery } from "@tanstack/react-query";

import { sectionsService } from "@/services/sections.service";

export const tolcSectionsQuery = {
  queryKey: ["tolc-sections"],
  queryFn: () => sectionsService.list(),
  staleTime: Infinity,
};

export function useTolcSections() {
  return useQuery(tolcSectionsQuery);
}
