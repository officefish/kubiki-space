
import {FC, PropsWithChildren, } from "react";

const Content: FC <PropsWithChildren> = ({ children }) => {
  
  /* */
//   useEffect(() => {
//     const timer = setInterval(async () => {
     
//       // const options: RequestInit = {
//       //   method: "GET",
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     ...(Auth.accessToken ? { 'Authorization': `Bearer ${Auth.accessToken}` } : {})
//       //   },
//       //   //keepalive: false // Убедитесь, что вам это действительно нужно
//       // };

//       // const response = await fetch(`${Config.url}/balance`, options);
//       // console.log(response);
  

//     }, 10_000);
//     return () => clearInterval(timer);
//   }, []);


//axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, payload);
  
    return  (   
        <main className="min-h-52">
            {children}
        </main>
    ) 
}
export default Content