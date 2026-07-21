import { useEffect, useState } from "react"

// next-themes ne connaît le thème résolu qu'après le montage côté client
// (le serveur ne peut pas savoir si le thème "système" est clair ou sombre).
// Ce hook évite un flash de contenu incohérent entre le rendu serveur et client.
export function useEstMonte() {
  const [monte, setMonte] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- montage unique, pattern recommandé par next-themes
  useEffect(() => setMonte(true), [])
  return monte
}
