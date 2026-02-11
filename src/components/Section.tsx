import React from 'react'

type SectionVariant = 'tan' | 'forest' | 'wood' | 'crimson'

type SectionProps = {
  title: string
  text: string
  icon: React.ComponentType<{ size?: number }>
  variant?: SectionVariant
}

const Section: React.FC<SectionProps> = ({
  title,
  text,
  icon: Icon,
  variant = 'tan',
}) => {
  return (
    <section className={`info-card info-card--${variant}`}>
      <div className={`info-card__icon-bg info-card__icon-bg--${variant}`}>
        <Icon size={120} />
      </div>
      <div className="info-card__heading">
        <div className={`info-card__icon info-card__icon--${variant}`}>
          <Icon size={28} />
        </div>
        <h2 className="info-card__title">{title}</h2>
      </div>
      <p className="info-card__text">{text}</p>
    </section>
  )
}

export default Section
