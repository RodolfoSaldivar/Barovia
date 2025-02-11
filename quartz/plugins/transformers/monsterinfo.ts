import { QuartzTransformerPlugin } from "../types"

export const MonsterInfo: QuartzTransformerPlugin = () => {
  return {
    name: "MonsterInfo",
    markdownPlugins() {
      return [
        () => {
          return async (tree, file) => {
            const isMonster = file.data.relativePath?.includes("Bestiario")
            if (!isMonster) return

            const text = (file.value || "") as string
            const pattern = /creature: ([^\n]+)/
            const creatureName = text.match(pattern)?.[1] || null
            const nameForApi = creatureName?.replace(" ", "-").toLowerCase()

            try {
              const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${nameForApi}`)
              const data = await response.json()
              file.data.monsterinfo = data
            } catch (_err) {
              console.error("Failed to fetch monster: ", nameForApi)
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    monsterinfo: any
  }
}
