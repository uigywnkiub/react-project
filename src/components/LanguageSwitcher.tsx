import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  function handleChangeLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
    const language = event.target.value
    i18n.changeLanguage(language)
  }

  return (
    <select
      className={'language-switcher'}
      value={i18n.language}
      onChange={handleChangeLanguage}
    >
      <option value="en">English</option>
      <option value="uk">Українська</option>
    </select>
  )
}

export default LanguageSwitcher
