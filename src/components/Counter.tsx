import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'
import {
  BsFillArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
} from 'react-icons/bs'

import StoreState from '../assets/types/StoreState'
import { increment, decrement } from '../store/index'
import { theme } from '../assets/theme'

// I tried to define the styles in the component, so if not create an < any > type to styles, ts error with textAlign may occur
const sContainer: any = {
  display: 'flex',
  placeItems: 'center',
  textAlign: 'center',
  outline: 'none',
}

const sTitle: any = {
  fontSize: '2rem',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#75A99C',
}

const sCounter = { ...sTitle, width: '2.5rem', color: '#E3E3E3' }

const sButton = {
  padding: '1rem',
}

const Counter: React.FC = () => {
  const {
    main: { counter: storeCount },
  } = useSelector((state: StoreState) => state)
  const dispatch = useDispatch()

  const { t } = useTranslation()

  function keyDownHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      dispatch(decrement())
    }

    if (event.key === 'ArrowRight') {
      dispatch(increment())
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <span style={sTitle}>{t('title')}</span>

      <div tabIndex={0} onKeyDown={keyDownHandler} style={sContainer}>
        <Button
          color="primary"
          className="increaser"
          size="large"
          variant="text"
          style={sButton}
          onClick={() => dispatch(decrement())}
        >
          <BsFillArrowLeftSquareFill />
        </Button>

        <span
          style={sCounter}
          className={
            storeCount > 0 && storeCount <= 10 ? 'counter' : 'inactive'
          }
        >
          {storeCount}
        </span>

        <Button
          color="primary"
          className="increaser"
          size="large"
          variant="text"
          style={sButton}
          onClick={() => dispatch(increment())}
        >
          <BsFillArrowRightSquareFill />
        </Button>
      </div>
    </ThemeProvider>
  )
}

export default Counter
