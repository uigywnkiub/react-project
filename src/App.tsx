import * as React from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import { BallTriangle } from 'react-loader-spinner'
import { RxAvatar } from 'react-icons/rx'

import NotFound from './components/NotFound'
import Quotes from './components/Quotes'
import SearchEngine from './components/SearchEngine'
import LanguageSwitcher from './components/LanguageSwitcher'
import GameFight from './components/GameFight'

import StoreState from './assets/types/StoreState'
import { fakeAuthProvider } from './API/auth'
import { theme } from './assets/theme'

export default function App() {
  const {
    main: { isModalOpen: storeIsModalOpen },
  } = useSelector((state: StoreState) => state)

  return (
    <div className="auth-container">
      {storeIsModalOpen && (
        <a
          className="github-link"
          href="https://github.com/kas1qqqq/react-project"
          target={'_blank'}
        >
          GitHub
        </a>
      )}

      {storeIsModalOpen && <LanguageSwitcher />}

      <h1>React Project</h1>

      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<Quotes />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/games/fight" element={<GamesPage />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>

      {storeIsModalOpen && (
        <>
          <p className="me">Volodymyr Gerun</p>
          <p className="company">AlterEGO</p>
        </>
      )}
    </div>
  )
}

function Layout() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="auth-container">
      <AuthStatus />

      <ul className="link-container">
        <li>
          <Link
            className={location.pathname === '/' ? 'active' : ''}
            to="/"
          >
            {t('homePage.titleLink')}
          </Link>
        </li>
        <li>
          <Link
            className={
              location.pathname === '/news' ? 'active' : ''
            }
            to="/news"
          >
            {t('newsPage.titleLink')}
          </Link>
        </li>
        <li>
          <Link
            className={
              location.pathname === '/games/fight' ? 'active' : ''
            }
            to="/games/fight"
          >
            {t('gamesPage.titleLink')}
          </Link>
        </li>
        <li>
          <Link
            className={
              location.pathname === '/profile' ? 'active' : ''
            }
            to="/profile"
          >
            {t('profilePage.titleLink')}
          </Link>
        </li>
      </ul>

      <Outlet />
    </div>
  )
}

interface AuthContextType {
  user: any
  userPass: any
  signin: (user: string, password: string, callback: VoidFunction) => void
  signout: (callback: VoidFunction) => void
}

const AuthContext = React.createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null)
  let [userPass, setUserPass] = React.useState<any>(null)

  const signin = (
    newUser: string,
    newUserPass: string,
    callback: VoidFunction
  ) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser)
      setUserPass(newUserPass)
      callback()
    })
  }

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null)
      setUserPass(null)
      callback()
    })
  }

  const value = { user, userPass, signin, signout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return React.useContext(AuthContext)
}

function AuthStatus() {
  const {
    t,
    i18n: { language: ln },
  } = useTranslation()

  const [isAuth, setIsAuth] = React.useState<boolean>(false)

  const userLocal = localStorage.getItem('username')

  const artificialDelay = () => {
    setTimeout(() => (!isAuth ? setIsAuth(false) : setIsAuth(true)), 0)
  }

  const auth = useAuth()
  const navigate = useNavigate()

  if (!auth.user && !userLocal) {
    return <p>{t('notLogIn')}</p>
  }

  const navigateHandler = () => {
    setIsAuth(true)

    auth.signout(() => {
      artificialDelay()
      navigate('/')
    })
  }

  return (
    <div className="auth-success-container">
      <div className="auth-success-title">
        <p>
          {t('welcomeUser')} {!userLocal ? auth.user : userLocal}
        </p>
        <RxAvatar />
      </div>

      <ThemeProvider theme={theme}>
        <Button
          size="medium"
          color="secondary"
          variant="contained"
          onClick={navigateHandler}
        >
          {!isAuth ? (
            <span className="my-lowercase">{t('signOut')}</span>
          ) : (
            <BallTriangle
              height={28}
              width={ln === 'en' ? 63 : 47.5}
              radius={5}
              color="#646cff"
              ariaLabel="ball-triangle-loading"
              visible={true}
            />
          )}
        </Button>
      </ThemeProvider>
    </div>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let isAuth = fakeAuthProvider.isAuthenticated

  const userLocal = localStorage.getItem('username')?.toString()
  const userPassLocal = localStorage.getItem('password')?.toString()

  const location = useLocation()
  const auth = useAuth()

  if (userLocal && userPassLocal) isAuth = true

  if (!auth.user && !auth.userPass && !isAuth) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  }

  return children
}

function LoginPage() {
  const [loginLenght, setLoginLenght] = React.useState<boolean>(false)
  const [isLoginValid, setIsLoginValid] = React.useState<boolean>(false)

  const [passLenght, setPassLenght] = React.useState<boolean>(false)
  const [isPassValid, setIsPassValid] = React.useState<boolean>(false)

  const [isFormValid, setIsFormValid] = React.useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const {
    t,
    i18n: { language: ln },
  } = useTranslation()

  let from = location.state?.from?.pathname || '/'

  // if need to add many classes, use the case below
  // const className = ['my-input', isLoginValid ? 'isFormValid' : ''].join(' ')

  // don't use arrow func, cause it haven't build-in < ...args > param
  function classNames(...args: any[]) {
    return args.filter(Boolean).join(' ')
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (username.length !== 5) {
      setLoginLenght(true)
    } else {
      setLoginLenght(false)
    }

    if (username !== import.meta.env.VITE_USERNAME_KEY) {
      setIsLoginValid(true)
    } else {
      setIsLoginValid(false)
    }

    if (password.length !== 5) {
      setPassLenght(true)
    } else {
      setPassLenght(false)
    }

    if (password !== import.meta.env.VITE_PASSWORD_KEY) {
      setIsPassValid(true)
    } else {
      setIsLoginValid(false)
    }

    if (
      username === import.meta.env.VITE_USERNAME_KEY &&
      password === import.meta.env.VITE_PASSWORD_KEY
    ) {
      setIsPassValid(false)
      setIsFormValid(true)

      localStorage.setItem('username', username)
      localStorage.setItem('password', password)

      auth.signin(username, password, () => {
        // use { replace: true } to avoid redirecting to login if you're already in
        navigate(from, { replace: true })
      })
    }
  }

  return (
    <div>
      <p className="page-description">
        {t('profilePage.logInToViewProfilePage')} {from}
      </p>

      <form className="form-container" onSubmit={submitHandler}>
        <ThemeProvider theme={theme}>
          <Input
            className={classNames('my-input', isFormValid && 'form-valid')}
            placeholder={
              ln === 'en' ? t('username').toString() : t('username').toString()
            }
            name="username"
            color="primary"
            spellCheck="false"
            autoComplete="false"
            error={isLoginValid && isPassValid}
            type="text"
          />
        </ThemeProvider>

        <div className="form-error">
          {loginLenght && <span>{t('formError.loginLength')}</span>}
          {isLoginValid && <span>{t('formError.loginInvalid')}</span>}
        </div>

        <ThemeProvider theme={theme}>
          <Input
            className={classNames('my-input', isFormValid && 'form-valid')}
            placeholder={
              ln === 'en' ? t('password').toString() : t('password').toString()
            }
            name="password"
            color="primary"
            spellCheck="false"
            autoComplete="false"
            error={isPassValid}
            type="password"
          />
        </ThemeProvider>

        <div className="form-error">
          {passLenght && <span>{t('formError.passLength')}</span>}
          {isPassValid && <span>{t('formError.passInvalid')}</span>}
        </div>

        <ThemeProvider theme={theme}>
          <Button
            type="submit"
            size="medium"
            color="secondary"
            variant="contained"
          >
            {!isFormValid ? (
              <span className="my-lowercase">{t('loginBtn')}</span>
            ) : (
              <BallTriangle
                height={28}
                width={42}
                radius={5}
                color="#646cff"
                ariaLabel="ball-triangle-loading"
                visible={true}
              />
            )}
          </Button>
        </ThemeProvider>
      </form>
    </div>
  )
}

// use stock func cause it means a component
function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="auth-container">
      <h3>{t('homePage.title')}</h3>
      <SearchEngine />
    </div>
  )
}

function GamesPage() {
  const { t } = useTranslation()

  return (
    <>
      <h3>{t('gamesPage.title')}</h3>
      <p className="page-description">{t('gamesPage.fightDescription')}</p>
      <GameFight />
    </>
  )
}

function ProfilePage() {
  const { t } = useTranslation()

  return (
    <>
      <h3>{t('profilePage.title')}</h3>
      <p className="page-description">{t('profilePage.description')}</p>
    </>
  )
}
