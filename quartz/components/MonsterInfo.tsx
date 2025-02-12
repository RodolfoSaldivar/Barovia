import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const getModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2)
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

const SplitDesc = ({ desc }: any) => {
  return desc?.split("\n").map((line: string, i: number) => (
    <span key={i}>
      {line}
      <div style={{ marginBottom: "20px" }} />
    </span>
  ))
}

export default (() => {
  const MonsterInfo: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const monster = fileData?.monsterinfo
    const possibleNames = fileData?.possibleNames
    if (!monster && !possibleNames) return

    if (!monster)
      return (
        <div>
          <strong>Possible names:</strong>
          {possibleNames?.map((name: string, index: number) => <pre key={index}>{name}</pre>)}
        </div>
      )

    return (
      <div className="monster-stat-block">
        {monster.image && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              style={{ maxWidth: "400px", maxHeight: "400px" }}
              src={monster.image}
              alt={monster.name}
            />
          </div>
        )}
        <div className="monster-header">
          <h1>{monster.name}</h1>
          <p className="monster-meta">
            {monster.size} {monster.type}
            {monster.subtype ? ` (${monster.subtype})` : ""}, {monster.alignment}
          </p>
        </div>

        <div className="monster-stats">
          <div className="stat-line">
            <strong>Armor Class</strong>{" "}
            {monster.armor_class.map((ac: any) => `${ac.value} (${ac.type})`).join(", ")}
          </div>
          <div className="stat-line">
            <strong>Hit Points</strong> {monster.hit_points}
            {monster.hit_points_roll && <span> ({monster.hit_points_roll})</span>}
          </div>
          <div className="stat-line">
            <strong>Speed</strong>{" "}
            {Object.entries(monster.speed || {})
              .map(([key, value]) => `${key} ${value}`)
              .join(", ")}
          </div>
        </div>

        <div className="ability-scores">
          <div className="ability">
            <div className="ability-label">STR</div>
            <div className="ability-score">
              {monster.strength} ({getModifier(monster.strength)})
            </div>
          </div>
          <div className="ability">
            <div className="ability-label">DEX</div>
            <div className="ability-score">
              {monster.dexterity} ({getModifier(monster.dexterity)})
            </div>
          </div>
          <div className="ability">
            <div className="ability-label">CON</div>
            <div className="ability-score">
              {monster.constitution} ({getModifier(monster.constitution)})
            </div>
          </div>
          <div className="ability">
            <div className="ability-label">INT</div>
            <div className="ability-score">
              {monster.intelligence} ({getModifier(monster.intelligence)})
            </div>
          </div>
          <div className="ability">
            <div className="ability-label">WIS</div>
            <div className="ability-score">
              {monster.wisdom} ({getModifier(monster.wisdom)})
            </div>
          </div>
          <div className="ability">
            <div className="ability-label">CHA</div>
            <div className="ability-score">
              {monster.charisma} ({getModifier(monster.charisma)})
            </div>
          </div>
        </div>

        <div className="monster-details">
          {monster.proficiencies?.length > 0 && (
            <div className="stat-line">
              {Object.entries(
                monster.proficiencies.reduce((acc: { [key: string]: string[] }, p: any) => {
                  const [title, type] = p.proficiency.name.split(": ")
                  if (!acc[title]) acc[title] = []
                  acc[title].push(`${type} ${p.value >= 0 ? "+" : ""}${p.value}`)
                  return acc
                }, {}),
              ).map(([title, values]) => (
                <>
                  <strong>{title}</strong> {`${(values as string[]).join(", ")}`}
                </>
              ))}
            </div>
          )}

          {monster.damage_vulnerabilities?.length > 0 && (
            <div className="stat-line">
              <strong>Damage Vulnerabilities</strong> {monster.damage_vulnerabilities.join(", ")}
            </div>
          )}

          {monster.damage_resistances?.length > 0 && (
            <div className="stat-line">
              <strong>Damage Resistances</strong> {monster.damage_resistances.join(", ")}
            </div>
          )}

          {monster.damage_immunities?.length > 0 && (
            <div className="stat-line">
              <strong>Damage Immunities</strong> {monster.damage_immunities.join(", ")}
            </div>
          )}

          {monster.condition_immunities?.length > 0 && (
            <div className="stat-line">
              <strong>Condition Immunities</strong>{" "}
              {monster.condition_immunities.map((ci: any) => ci.name).join(", ")}
            </div>
          )}

          {monster.senses && (
            <div className="stat-line">
              <strong>Senses</strong>{" "}
              {Object.entries(monster.senses)
                .map(([key, value]) => `${key.replace(/_/g, " ")} ${value}`)
                .join(", ")}
            </div>
          )}

          {monster.languages && (
            <div className="stat-line">
              <strong>Languages</strong> {monster.languages}
            </div>
          )}

          {monster.challenge_rating && (
            <div className="stat-line">
              <strong>Challenge</strong> {monster.challenge_rating} ({monster.xp} XP)
              {monster.proficiency_bonus && (
                <span>, Proficiency Bonus +{monster.proficiency_bonus}</span>
              )}
            </div>
          )}
        </div>

        {monster.special_abilities?.length > 0 && (
          <div className="monster-abilities">
            <h2>Special Abilities</h2>
            {monster.special_abilities.map((ability: any, index: number) => (
              <div key={index} className="ability-block">
                <strong>{ability.name}.</strong> <SplitDesc desc={ability.desc} />
                {ability.usage && (
                  <span>
                    {" "}
                    ({ability.usage.times} {ability.usage.type}
                    {ability.usage.rest_types && `, ${ability.usage.rest_types.join(", ")}`})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {monster.actions?.length > 0 && (
          <div className="monster-actions">
            <h2>Actions</h2>
            {monster.actions.map((action: any, index: number) => (
              <div key={index} className="action-block">
                <strong>{action.name}.</strong> <SplitDesc desc={action.desc} />
                {action.attack_bonus && <span> Attack Bonus: +{action.attack_bonus}</span>}
                {action.damage?.map((dmg: any, i: number) => (
                  <span key={i}>
                    {" "}
                    {dmg.damage_dice}
                    {dmg.damage_type?.name ? ` ${dmg.damage_type.name}` : ""} damage
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        {monster.legendary_actions?.length > 0 && (
          <div className="monster-legendary-actions">
            <h2>Legendary Actions</h2>
            {monster.legendary_actions.map((action: any, index: number) => (
              <div key={index} className="action-block">
                <strong>{action.name}.</strong> <SplitDesc desc={action.desc} />
              </div>
            ))}
          </div>
        )}

        {monster.reactions?.length > 0 && (
          <div className="monster-reactions">
            <h2>Reactions</h2>
            {monster.reactions.map((reaction: any, index: number) => (
              <div key={index} className="action-block">
                <strong>{reaction.name}.</strong> <SplitDesc desc={reaction.desc} />
              </div>
            ))}
          </div>
        )}

        {monster.spellcasting && (
          <div className="monster-spellcasting">
            <h2>Spellcasting</h2>
            {monster.spellcasting.spells?.map((spell: any, index: number) => (
              <div key={index} className="spell-block">
                <strong>Level {spell.level}:</strong> {spell.name}
              </div>
            ))}
          </div>
        )}

        {monster.forms?.length > 0 && (
          <div className="monster-forms">
            <h2>Forms</h2>
            {monster.forms.map((form: any, index: number) => (
              <div key={index}>{form.name}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return MonsterInfo
}) satisfies QuartzComponentConstructor
