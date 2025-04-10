import { FC, useEffect, useState } from "react"
import Content from "./content"
import Footer from "./footer"
import Screen from "./screen"

import { 
  //Route, 
  Routes } from "react-router-dom"
import Header from "./header"
import { useGetUser } from "@/rest/getUser"
import { WithLoader } from "@/components/loading"
// import DashboardPage from "@/pages/dashpoard.page"
// import SettingsPage from "@/pages/settings.page"
// import LongPoolingPage from "@/pages/long-pooling"
// import { useMinerConf } from "@/hooks/cgi/useMinerConf"
// import { cgiFetch } from "@/services/cgi/cgi.fetch"
// import { getRandomInt } from "@/utils/getRandomInt"
// import { useAccountStore } from "@/providers/account"
// import LogsPage from "@/pages/logs.page"

//import { WithLoader } from "@/components/loading"
//import { apiFetch } from "@/services/api"

//import { useSiteStore } from "@/providers/site"

const Cabinet:FC = () => {
  
//    const { setIsEmptyPage } = useSiteStore()

  const [isLoading, 
    setIsLoading
  ] = useState(true);

//   useEffect(() => {
//     setIsEmptyPage(isLoading)
//   }, [isLoading])

//   const { updateBalance } = useUpdateBalance(apiFetch)
//   const { updateFortunes } = useUpdateFortunes(apiFetch)
  
  const { getUser } = useGetUser()

  const loadResources = async () => {
    try {
      // Загружаем все ресурсы параллельно
      await Promise.all([
        getUser(),
        //getPosts(),
        //getSettings()
      ]);
  
      // Ждём 2 секунды после загрузки
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      // Выключаем прелоадер
      setIsLoading(false);
      console.log('complete load resources');
    } catch (error) {
      console.error('Ошибка при загрузке ресурсов:', error);
    }
  };

  const [isPreflight, setIsPreflight] = useState(false);

  useEffect(() => {
    if (!isPreflight) {
      setIsPreflight(true)
      loadResources()
    }
  }, [loadResources, isPreflight, setIsPreflight]);


  //const [isPC, setIsPC] = useState(false);

return (
  <WithLoader isLoading={isLoading}>
    <Screen>
    <Header />
      <Content>
        <Routes>
        {/* { isPC ? (
          <Route path='*' element={<Mobile/>}/>
        ) : ( */}
          <>
            {/* <Route path='/' element={<DashboardPage/>}/>
            <Route path='/settings' element={<SettingsPage/>}/>
            <Route path='/long-pooling' element={<LongPoolingPage/>}/>
            <Route path='/logs' element={<LogsPage/>}/> */}
          </>
          {/* ) } */}
        </Routes>
      </Content>
      <Footer>
      </Footer>
    </Screen>
  </WithLoader>
)}

export default Cabinet