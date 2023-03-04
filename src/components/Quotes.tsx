import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import { ThemeProvider } from '@mui/material/styles'
import { BallTriangle } from 'react-loader-spinner'
import { RiSearchLine, RiCommandFill, RiDeleteBack2Line } from 'react-icons/ri'
import Highlighter from 'react-highlight-words'

import { updateIsModalValue } from '../store/index'
import QuotesData from '../assets/types/QuotesState'
import { theme } from '../assets/theme'

const sModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#252529',
  boxShadow: 24,
  p: 3,
  borderRadius: '0.3rem',
  outline: 'none',
}

const URL = 'https://dummyjson.com/quotes?limit='

const Quotes: React.FC = () => {
  const {
    t,
    i18n: { language: ln },
  } = useTranslation()

  const dispatch = useDispatch()

  const [data, setData] = React.useState<QuotesData[]>([])
  const [filteredData, setFilteredData] = React.useState<QuotesData[]>([])
  const [isMatchAuthor, setIsMatchAuthor] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [open, setOpen] = React.useState<boolean>(false)
  const [page, setPage] = React.useState<number>(1)
  const [searchValue, setSearchValue] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')

  const focusToHotKey = React.useRef<HTMLDivElement>(null)
  const focusToModalInput = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${URL}${page}`)
        const data = await res.json()
        if (!error && page >= 1) {
          setData(data.quotes)
        }
      } catch (e: any) {
        setError(e.message)
        throw new Error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page])

  const loadMoreHandler: VoidFunction = () => {
    focusToHotKey.current?.focus()
    setPage((prevPage) => prevPage + 1)
  }

  const deleteQuoteHandler = (idx: number) => {
    setData(data.filter((quoteToDelete) => quoteToDelete.id !== idx))

    if (page !== 1) {
      setPage((prevPage) => prevPage - 1)
    } else {
      setPage((prevPage) => prevPage - 1)
    }
  }

  const openModalHandler: VoidFunction = () => {
    setOpen(true)
    dispatch(updateIsModalValue(open))
  }

  const closeModalHandler: VoidFunction = () => {
    setOpen(false)
    setSearchValue('')
    dispatch(updateIsModalValue(open))
  }

  const keyPressHandler: React.KeyboardEventHandler = (
    event: React.KeyboardEvent
  ): void => {
    if (event.metaKey && event.key === 'k') {
      openModalHandler()
    }
  }

  React.useEffect(() => {
    if (searchValue === '') {
      setFilteredData([])
      setIsMatchAuthor(true)
      return
    }

    const filtered = data.filter((el) => {
      // < g > - match all occurrences of the pattern in the input string, rather than just the first one
      // < i > - ignore case, match characters regardless of their case
      const regex = new RegExp(searchValue, 'gi')
      return el.author.match(regex)
    })

    // limit to 3 authors to avoid overflow UI on some unusual screen
    setFilteredData(filtered.slice(0, 3))

    if (filtered.length === 0) setIsMatchAuthor(false)
  }, [searchValue])

  return (
    <div
      style={{
        opacity: `${open ? '0.8' : '1'}`,
        filter: `${open ? 'blur(0.5px)' : ''}`,
      }}
      className="quotes-container"
    >
      <h3 style={{ marginBottom: '1rem' }}>{t('newsPage.title')}</h3>

      {!open && data.length >= 1 && (
        <div
          tabIndex={0}
          ref={focusToHotKey}
          className="not-modal-container"
          style={{
            display: `${data.length > 0 ? 'flex' : 'none'}`,
            alignItems: 'center',
            cursor: 'pointer',
            position: 'sticky',
            top: '2rem',
            left: '50%',
            transform: 'translate(-50%, 0%)',
          }}
          onBlur={() => focusToHotKey.current?.focus()}
          onKeyDown={keyPressHandler}
          onClick={openModalHandler}
        >
          <RiSearchLine className="not-modal-icon" />
          <input
            autoFocus
            readOnly
            type="text"
            placeholder={`${t('newsPage.searchPlaceholder')}`}
            className="not-modal-field"
          />
          <div className="hot-modal-key">
            <RiCommandFill style={{ fontSize: '0.8rem' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>K</span>
          </div>
        </div>
      )}

      <Modal keepMounted open={open} onClose={closeModalHandler}>
        <Box
          onFocus={() =>
            filteredData.length === 0 && focusToModalInput.current?.focus()
          }
          className="modal"
          sx={sModal}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RiSearchLine className="search-icon-modal" />
            <input
              ref={focusToModalInput}
              autoFocus
              type="text"
              placeholder={`${t('newsPage.modalPlaceholder')}`}
              className="input-modal"
              value={searchValue}
              spellCheck={false}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <h4 style={{ marginLeft: '-0.5rem' }}>esc</h4>
          </div>

          {!isMatchAuthor && !filteredData.length && (
            <p
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                color: '#A1A1A9',
              }}
            >
              {t('newsPage.noMatchAuthor')}
            </p>
          )}

          {!!filteredData.length &&
            filteredData.map((quote) => (
              <div key={quote.id}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      marginTop: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '500',
                      fontStyle: 'italic',
                    }}
                  >
                    <Highlighter
                      highlightStyle={{
                        fontSize: '1.2rem',
                        padding: '0.1rem 0.1rem 0.1rem 0.1rem',
                      }}
                      searchWords={[searchValue]}
                      autoEscape={true}
                      unhighlightStyle={{
                        color: '#E4E4E5',
                        fontWeight: '400',
                        fontSize: '1.2rem',
                      }}
                      activeIndex={0}
                      textToHighlight={quote.author}
                    />
                  </div>
                  <h3 style={{ color: '#A1A1A9', fontWeight: '500' }}>
                    {quote.quote}
                  </h3>
                  <hr
                    color="#75A99C"
                    style={{
                      width: '100%',
                      borderRadius: '0.3rem',
                      marginTop: '0.13rem',
                    }}
                  />
                </div>
              </div>
            ))}
        </Box>
      </Modal>

      {error && !isLoading && data && <p className="error">{error}</p>}

      {page === 0 && (
        <div style={{ marginTop: '1rem' }}>
          <span>{t('newsPage.oops')}</span>
          <p>{t('newsPage.noQuotes')}</p>
        </div>
      )}

      {data &&
        data.map((quote) => (
          <div
            style={{
              opacity: `${!filteredData.length ? '1' : '0.2'}`,
            }}
            key={quote.id}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: '0.5rem',
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>
                <img
                  src={`https://robohash.org/${`${quote.author}`}.png`}
                  alt={`Robot: ${quote.author}`}
                  width="100%"
                  height="60px"
                />
              </span>

              <h2 style={{ color: '#FEBC2E' }}>{quote.author}</h2>

              <ThemeProvider theme={theme}>
                <Button
                  size="medium"
                  color="primary"
                  variant="text"
                  onClick={() => {
                    setTimeout(() => {
                      deleteQuoteHandler(quote.id)
                    }, 300)
                  }}
                >
                  {!open && (
                    <RiDeleteBack2Line style={{ fontSize: '1.5rem' }} />
                  )}
                </Button>
              </ThemeProvider>
            </div>

            <p className="quotes">{quote.quote}</p>
          </div>
        ))}

      {!open && (
        <ThemeProvider theme={theme}>
          <Button
            type="submit"
            size="medium"
            color="secondary"
            variant="contained"
            sx={{ marginTop: '1rem' }}
            onClick={loadMoreHandler}
          >
            {!isLoading ? (
              <span className="my-lowercase">{t('newsPage.loadMoreBtn')}</span>
            ) : (
              <BallTriangle
                height={28}
                width={ln === 'en' ? 81 : 109}
                radius={5}
                color="#646cff"
                ariaLabel="ball-triangle-loading"
                visible={true}
              />
            )}
          </Button>
        </ThemeProvider>
      )}
    </div>
  )
}

export default Quotes
