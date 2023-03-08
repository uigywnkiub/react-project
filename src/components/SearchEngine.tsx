import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { FallingLines, MagnifyingGlass } from 'react-loader-spinner'

import Counter from './Counter'
import { useAppSelector } from '../hook'
import SearchEngineType from '../types/SearchEngineType'
import artificialDelay from '../API/delay'
import { theme } from '../assets/theme'

const URL: string = 'https://jsonplaceholder.typicode.com/users'

const SearchEngine: React.FC = () => {
  const [data, setData] = React.useState<SearchEngineType>()
  const [isCounterMatch, setIsCounterMatch] = React.useState<boolean>(false)
  const [isUserExist, setIsUserExist] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isFulfilled, setIsFulfilled] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')

  const storeCount = useAppSelector((state) => state.store.counter)

  const { t } = useTranslation()

  React.useEffect(() => {
    setIsUserExist(false)

    if (isFulfilled) {
      if (storeCount === data?.id) setIsUserExist(true)

      const fetchData = async () => {
        try {
          const res = await fetch(`${URL}/${storeCount}`)
          const data = await res.json()
          setData(data)
          setTimeout(() => {
            setIsFulfilled(false)
          }, artificialDelay(1500, 3000))
        } catch (e: any) {
          setError(e.message)
          throw new Error(e)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()

      if (storeCount !== data?.id) setIsUserExist(false)
    }
  }, [isFulfilled])

  return (
    <div className="search-engine-container">
      <Counter />

      {isUserExist && (
        <h2>
          <span className="error">{data?.username} </span>
          {t('userExist')}
        </h2>
      )}

      {isCounterMatch && <p className="error">{t('counterMatch')}</p>}

      {isFulfilled && !isUserExist && !error && (
        <FallingLines color="#646cff" width="80" visible={true} />
      )}

      {error && !isLoading && <h2 className="error">{error}</h2>}

      {!error && !isLoading && !isFulfilled && !isCounterMatch && (
        <div>
          <h2
            style={{
              color: storeCount > 0 && storeCount <= 10 ? '#FEBC2E' : '#AEBAC8',
            }}
          >
            {data?.username}
          </h2>
          <p
            style={{
              color: storeCount > 0 && storeCount <= 10 ? '#35D5C8' : '#AEBAC8',
            }}
          >
            {data?.company.name}
          </p>
        </div>
      )}

      {!isUserExist && (
        <div style={{ marginTop: '0.5rem' }}>
          <ThemeProvider theme={theme}>
            <Button
              size="medium"
              color="primary"
              variant="outlined"
              disabled={isFulfilled}
              className={isFulfilled ? 'inactive' : ''}
              onClick={() => {
                if (storeCount > 0 && storeCount <= 10) {
                  setIsFulfilled(true)
                  setIsCounterMatch(false)
                } else {
                  setIsCounterMatch(true)
                }
              }}
            >
              <span className="my-lowercase">{t('findBtn')}</span>
              <MagnifyingGlass
                height={28}
                width={28}
                color="#646cff"
                ariaLabel="MagnifyingGlass-loading"
                glassColor="#AEBAC8"
                visible={isFulfilled}
              />
            </Button>
          </ThemeProvider>
        </div>
      )}
    </div>
  )
}

export default SearchEngine
