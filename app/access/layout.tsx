import { Toaster } from "react-hot-toast"
import "../globals.css"
  const AccessLayout=({children}:{children:React.ReactNode})=>{
  return <html>
    <body>
      <div>
        {children}
      </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
        
        />
    </body>
  </html>
}


export default AccessLayout