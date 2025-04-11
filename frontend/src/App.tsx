import { FC, 
  //useEffect, 
  //useState 
} from 'react'
import './App.css'
import Providers from './providers'
import { BrowserRouter } from 'react-router-dom'
import Cabinet from './layout/cabinet'

import useLocale from './i18n/useLocale'

const App:FC = () => {

useLocale()

//console.log('RSYNC TEST ' + new Date());


return (
  <Providers>
    <BrowserRouter 
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
    >
      <Cabinet />
    </BrowserRouter>
  </Providers>
)

}

export default App