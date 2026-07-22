"use server"

import { exigerContexteWorkspace } from "@/lib/auth/guards"
import {
  obtenirPointsGraphique,
  type MetriqueGraphique,
  type PeriodeGraphique,
  type PointGraphique,
} from "@/modules/dashboard/services/revenue-chart.service"

export async function obtenirPointsGraphiqueAction(
  orgSlug: string,
  wsSlug: string,
  periode: PeriodeGraphique,
  metrique: MetriqueGraphique
): Promise<PointGraphique[]> {
  const { workspace } = await exigerContexteWorkspace(orgSlug, wsSlug)
  return obtenirPointsGraphique(workspace.id, periode, metrique)
}
