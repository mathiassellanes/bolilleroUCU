import { useState } from 'react'
import classNames from 'classnames'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

function App() {
  const [maxBolillas, setMaxBolillas] = useState(75)

  const [clickEnabled, setClickEnabled] = useState(false)

  const bolillasDefault = Array.from({ length: maxBolillas }, (_, i) => i + 1)

  const [bolillasSorteadas, setBolillasSorteadas] = useState([localStorage.getItem('bolillasSorteadas') ? JSON.parse(localStorage.getItem('bolillasSorteadas')) : []].flat())
  const [bolillas, setBolillas] = useState(bolillasDefault.filter(bolilla => !bolillasSorteadas.includes(bolilla)))

  const handle = () => {
    const index = Math.floor(Math.random() * bolillas.length)
    const bolilla = bolillas[index]

    if (bolillas.length) {
      localStorage.setItem('bolillasSorteadas', JSON.stringify([...bolillasSorteadas, bolilla]))
      setBolillasSorteadas([...bolillasSorteadas, bolilla])
      setBolillas(bolillas.filter((_, i) => i !== index))
    }
  }

  console.log({ bolillasSorteadas, bolillas })

  const handleKeyPress = (event) => {
    if (event.code === 'Space') {
      handle()
    }

    if (event.code === 'Escape') {
      localStorage.removeItem('bolillasSorteadas')
      setBolillasSorteadas([])
      setBolillas(bolillasDefault)
    }
  }

  const handleClickBolilla = (bolilla) => {
    if (clickEnabled) {
      const index = bolillasSorteadas.indexOf(bolilla)
      if (index !== -1) {
        const newBolillasSorteadas = bolillasSorteadas.filter((_, i) => i !== index)
        localStorage.setItem('bolillasSorteadas', JSON.stringify(newBolillasSorteadas))
        setBolillasSorteadas(newBolillasSorteadas)
        setBolillas([...bolillas, bolilla])
      } else {
        const newBolillasSorteadas = [...bolillasSorteadas, bolilla]
        localStorage.setItem('bolillasSorteadas', JSON.stringify(newBolillasSorteadas))
        setBolillasSorteadas(newBolillasSorteadas)
        setBolillas(bolillas.filter(bolillaFilter => bolillaFilter !== bolilla))
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyPress)
    return () => {
      window.removeEventListener('keyup', handleKeyPress)
    }
  })

  return (
    <div className="bolillero">
      <div className="tablero">
        {
          bolillasDefault.map((bolilla, index) => (
            <div
              key={index}
              className={classNames('bolilla', {
                'bolilla--sorteada': bolillasSorteadas.includes(bolilla),
                'bolilla--click-enabled': clickEnabled,
              })}
              onClick={() => handleClickBolilla(bolilla)}
            >
              {bolilla}
            </div>
          ))
        }
      </div>
      <div className='bolillero__sorteado'>
        <span className='bolillero__sorteado__text'>
          BINGO UCU
        </span>
        <div className='bolilla bolilla--grande'>
          {bolillasSorteadas[bolillasSorteadas.length - 1]}
        </div>
        <button
          onClick={handle}
          className="tablero__sortear"
          onKeyDown={(event) => {
            if (event.code === 'Space') {
              event.preventDefault()
              event.stopPropagation()
            }
          }}
        >
          Sortear
        </button>
        <label className="tablero__enable__click__label">
          Habilitar click
          <input
            onClick={() => {
              setClickEnabled(!clickEnabled)
            }}
            value={clickEnabled}
            className="tablero__enable__click"
            type='checkbox'
          />
        </label>
      </div>
    </div>
  )
}

export default App
