import { QuartzTransformerPlugin } from "../types"

export const MonsterInfo: QuartzTransformerPlugin = () => {
  return {
    name: "MonsterInfo",
    markdownPlugins() {
      return [
        () => {
          return async (_, file) => {
            const isMonster = file.data.relativePath?.includes("Bestiario")
            if (!isMonster) return

            const BASE_URL = "https://www.dnd5eapi.co"
            const text = (file.value || "") as string

            const imageName = text.match(/image: ([^\n]+)/)?.[1]
            const sourceName = text.match(/source: ([^\n]+)/)?.[1]
            const creatureName = text.match(/creature: ([^\n]+)/)?.[1]

            const monsterName = sourceName || creatureName || null
            const nameForApi = monsterName?.replace(" ", "-").toLowerCase()

            if (!nameForApi) return

            try {
              const response = await fetch(`${BASE_URL}/api/monsters/${nameForApi}`)
              const data = await response.json()
              const image = data?.image ? `${BASE_URL}${data.image}` : imageName
              file.data.monsterinfo = { ...data, image }
              return
            } catch (_) {}

            try {
              const response = await fetch(`${BASE_URL}/api/monsters`)
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
