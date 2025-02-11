import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// import style from "./styles/monsterInfo.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

export default (() => {
  const MonsterInfo: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
	console.log('%c7 - fileData: ', 'background-color: yellow', fileData?.monsterinfo);
    return <div>{fileData?.monsterinfo?.name}</div>
  }

  // MonsterInfo.css = style
  return MonsterInfo
}) satisfies QuartzComponentConstructor
