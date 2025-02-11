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

            const sourcePattern = /source: ([^\n]+)/
            const creaturePattern = /creature: ([^\n]+)/
            const sourceName = text.match(sourcePattern)?.[1]
            const creatureName = text.match(creaturePattern)?.[1]
            
            const monsterName = sourceName || creatureName || null
            const nameForApi = monsterName?.replace(" ", "-").toLowerCase()

            if (!nameForApi) return

            try {
              const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${nameForApi}`)
              const data = await response.json()
              file.data.monsterinfo = data
              return
            } catch (_) {}

            try {
              const response = await fetch(`https://www.dnd5eapi.co/api/monsters`)
              const data = await response.json()

              const possibleNames = data?.results
                ?.filter((currResult: any) => currResult.index.includes(nameForApi))
                .map((currResult: any) => currResult.index)

              file.data.possibleNames = possibleNames
              return
            } catch (_) {}
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    monsterinfo: any
    possibleNames: string[]
  }
}
