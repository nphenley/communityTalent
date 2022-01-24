import { FaIdCard, FaNetworkWired, FaBriefcase, FaUser  } from "react-icons/fa";

const SideBar = () => {
    return (
        <div className="fixed top-0 left-0 flex flex-col h-screen m-0 text-center bg-gray-900 shadow-lg w-1/10 text-cyan-400">
            
            <header className="mt-4">
                Neo Tokyo Talent
            </header>
            <div className="flex-grow mx-2 mt-12 mb-20">
             
                
                    <SideBarIcon icon={<FaBriefcase size="20" />} text={"JOBS"}/>
                    <SideBarIcon icon={<FaIdCard size="20" />} text={"TALENT"}/>
                    <SideBarIcon icon={<FaNetworkWired size="20" />} text={"CONNECTIONS"}/>
            
                
            </div>
            

            <ProfileIcon icon={<FaUser size="40" />}/>
            
        </div>
    )
};

const SideBarIcon = ({icon, text}) => (
        <div className="w-full px-2 py-8 hover:bg-cyan-700 hover:rounded-md">
            <div className="px-12"> 
                
                    {icon}
              

            </div>
            <div className="">{text}</div>
        </div>  
)

const ProfileIcon = ({icon}) => (

    <footer className="mx-auto mb-6 hover:bg-cyan-700 hover:rounded-md"> 
  
        {icon}
   
    </footer>


)

export default SideBar; 