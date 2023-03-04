import React from 'react'
import { ImSad2 } from 'react-icons/im'
import { useTranslation } from 'react-i18next'

const sNotFound: any = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  height: 'calc(100vh - 8rem)',
  gap: '1rem',
}

const sTitle = {
  fontSize: '8rem',
  marginBottom: '-2.5rem',
}

const sDescription = {
  fontSize: '1.2rem',
  color: '#555',
  width: '70%',
}

const NotFound: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div style={sNotFound}>
      <span style={sTitle}>
        <ImSad2 />
      </span>
      <h2>404 - {t('langSwitcher.title')}</h2>
      <p style={sDescription}>{t('langSwitcher.subtitle')}</p>
    </div>
  )
}

export default NotFound
