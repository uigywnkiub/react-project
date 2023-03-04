import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { BsFillVolumeDownFill, BsFillVolumeMuteFill } from 'react-icons/bs'

import artificialDelay from '../API/delay'
import battleMain from '../assets/sounds/battleMain.wav'
import battleStart from '../assets/sounds/battleStart.wav'
import battleEnd from '../assets/sounds/battleEnd.wav'

const GameFight: React.FC = () => {
  const { t, i18n } = useTranslation()

  const [playerPosition, setPlayerPosition] = React.useState<number>(0)
  const [opponentPosition, setOpponentPosition] = React.useState<number>(0)
  const [isTurnOnSound, setIsTurnOnSound] = React.useState<boolean>(true)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [isLeave, setIsLeave] = React.useState<boolean>(false)
  const [player1, setPlayer1] = React.useState<string | null>('Player 1')
  const [player2, setPlayer2] = React.useState<string | null>('Player 2')

  const focusToGame = React.useRef<HTMLDivElement>(null)
  const battleMainSfx = React.useRef<HTMLAudioElement>(new Audio(battleMain))
  const battleStartSfx = React.useRef<HTMLAudioElement>(new Audio(battleStart))
  const battleEndSfx = React.useRef<HTMLAudioElement>(new Audio(battleEnd))

  const startGame: VoidFunction = () => {
    // paste < ! > before player1 and player2 to deactivate feature
    if (player1 && player1 === 'Player 1') {
      setPlayer1(prompt(t('gamesPage.namePlayer').toString(), 'Player 1'))
    }
    if (player2 && player2 === 'Player 2') {
      setPlayer2(prompt(t('gamesPage.nameOpponent').toString(), 'Player 2'))
    }

    setIsPlaying(true)
    setPlayerPosition(0)
    setOpponentPosition(0)
  }

  const endGame: VoidFunction = () => setIsPlaying(false)

  const playMainSound: VoidFunction = () => {
    battleMainSfx.current.play()
    battleMainSfx.current.volume = 1
  }
  const playStartSound: VoidFunction = () => battleStartSfx.current.play()
  const playEndSound: VoidFunction = () => battleEndSfx.current.play()

  const stopMainSound: VoidFunction = () => {
    battleMainSfx.current.pause()
    battleMainSfx.current.currentTime = 0
  }
  const stopStartSound: VoidFunction = () => {
    battleStartSfx.current.pause()
    battleStartSfx.current.currentTime = 0
  }

  const handleKeyPress: React.KeyboardEventHandler = (
    event: React.KeyboardEvent
  ): void => {
    if (event.key === 'Enter' && !isPlaying) {
      setTimeout(() => {
        if (isTurnOnSound) {
          playMainSound()
          playStartSound()
        }
      }, 500)

      startGame()
    }

    if (event.key === 'Escape' && isPlaying) {
      if (isTurnOnSound) {
        stopMainSound()
        stopStartSound()
      }

      endGame()
    }

    if (event.key === 'a' && isPlaying && playerPosition > 0) {
      setPlayerPosition(playerPosition + artificialDelay(10, 30))
    } else if (event.key === 'ф' && isPlaying && playerPosition > 0) {
      setPlayerPosition(playerPosition + artificialDelay(10, 30))
    }

    if (event.key === 'l' && isPlaying && opponentPosition > 0) {
      setOpponentPosition(opponentPosition + artificialDelay(10, 30))
    } else if (event.key === 'д' && isPlaying && opponentPosition > 0) {
      setOpponentPosition(opponentPosition + artificialDelay(10, 30))
    }
  }

  React.useEffect(() => {
    if (isPlaying) {
      setIsLeave(false)

      const intervalId = setInterval(() => {
        setPlayerPosition(playerPosition + artificialDelay(10, 20))
        setOpponentPosition(opponentPosition + artificialDelay(10, 20))
      }, 500)

      if (playerPosition > 1000 || opponentPosition > 1000) {
        stopMainSound()
        endGame()
      }

      if (playerPosition >= 800 || opponentPosition >= 800) {
        // smoothly adjust volume down
        const timerVolumeDown = setInterval(() => {
          battleMainSfx.current.volume +=
            (0.2 - battleMainSfx.current.volume) / (2000 / 100)

          if (
            Math.abs(battleMainSfx.current.volume - 0.2) <
            (0.2 - battleMainSfx.current.volume) / (2000 / 100)
          ) {
            // removing this block may cause the volume to drop after the game is over, so don't touch this comment and block
            // clearInterval(timerVolumeDown)
          }

          if (battleMainSfx.current.volume <= 0.3) {
            clearInterval(timerVolumeDown)
          }
        }, 100)

        if (isTurnOnSound) {
          if (
            Math.floor(playerPosition / 6) ||
            Math.floor(opponentPosition / 6) > 95
          ) {
            playEndSound()
          }
        }
      }

      if (isTurnOnSound) {
        if (battleMainSfx.current.ended) {
          playMainSound()
        }
      }

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isPlaying, playerPosition, opponentPosition])

  const focusToGameHandler = (event: MouseEvent) => {
    if (event.clientY >= 65) focusToGame.current?.focus()
  }

  // independent of the game, clean-up effect
  React.useEffect(() => {
    focusToGame.current?.focus()

    i18n.on('languageChanged', () => focusToGame.current?.focus())
    addEventListener('click', focusToGameHandler)

    return () => {
      if (!isLeave) {
        battleMainSfx.current.pause()
        battleMainSfx.current.currentTime = 0
        removeEventListener('click', focusToGameHandler)
        i18n.off('languageChanged', () => focusToGame.current?.focus())
      }
    }
  }, [!isLeave])

  return (
    <div
      style={{ outline: 'none' }}
      ref={focusToGame}
      tabIndex={0}
      onKeyUp={handleKeyPress}
    >
      {!isPlaying && !isPlaying && (
        <div style={{ textAlign: 'right' }}>
          {isTurnOnSound ? (
            <BsFillVolumeDownFill
              onClick={() => setIsTurnOnSound(!isTurnOnSound)}
            />
          ) : (
            <BsFillVolumeMuteFill
              onClick={() => setIsTurnOnSound(!isTurnOnSound)}
            />
          )}
        </div>
      )}

      {isPlaying ? (
        <>
          <div style={{ display: 'flex', width: '20rem' }}>
            <div
              className="hero1"
              style={{
                width: `${playerPosition * 10}%`,
                borderRight: '0.3rem solid #333',
                borderTopLeftRadius: '0.3rem',
                borderBottomLeftRadius: '0.3rem',
                backgroundPositionX: `${
                  ((playerPosition * 10) / opponentPosition) *
                  artificialDelay(5, 10)
                }%`,
                backgroundColor: '#fff',
                height: '5rem',
              }}
            ></div>
            <div
              className="hero2"
              style={{
                width: `${opponentPosition * 10}%`,
                borderRight: '0.3rem solid #333',
                borderBottomLeftRadius: '0.3rem',
                borderTopLeftRadius: '0.3rem',
                backgroundPositionX: `${
                  ((opponentPosition * 10) / playerPosition) *
                  artificialDelay(5, 10)
                }%`,
                backgroundColor: '#fff',
                height: '5rem',
              }}
            ></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ color: 'red' }}>{player1}</h2>
            <h2 style={{ color: 'blue' }}>{player2}</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: 'bold' }}>
              {t('gamesPage.fightControl.press')} A
            </p>
            <p style={{ fontWeight: 'bold' }}>
              {t('gamesPage.fightControl.press')} L
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: 'bold' }}>
              <span style={{ opacity: '0.6' }}>{playerPosition}</span>/
              <span style={{ color: 'lightgreen' }}>1000</span>
            </p>
            <p style={{ fontWeight: 'bold' }}>
              <span style={{ opacity: '0.6' }}>{opponentPosition}</span>/
              <span style={{ color: 'lightgreen' }}>1000</span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 1rem 1rem 2rem',
              border: '0.1rem solid #858585',
              borderRadius: '0.3rem',
            }}
          >
            <ul>
              <li>
                <span style={{ fontWeight: 'bold' }}>Enter</span> -{' '}
                {t('gamesPage.fightControl.enter')}
              </li>
              <li>
                <span style={{ fontWeight: 'bold' }}>Escape</span> -{' '}
                {t('gamesPage.fightControl.escape')}
              </li>
              <li>
                <span style={{ fontWeight: 'bold' }}>Key A</span> -{' '}
                {t('gamesPage.fightControl.keyA')}
              </li>
              <li>
                <span style={{ fontWeight: 'bold' }}>Key L</span> -{' '}
                {t('gamesPage.fightControl.keyL')}
              </li>
            </ul>
          </div>

          {!!playerPosition && (
            <>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ fontSize: '1.5rem' }}>
                  {t('gamesPage.winner')}:{' '}
                  <span style={{ color: 'lightgreen', fontWeight: 'bold' }}>
                    {playerPosition > opponentPosition
                      ? `${player1} !`
                      : `${player2} !`}
                  </span>
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default GameFight
