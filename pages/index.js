import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import SideBar from '../components/SideBar'
import { FaIdCard, FaNetworkWired, FaBriefcase, FaUser, FaBars, FaArrowLeft  } from "react-icons/fa";


export default function Home() {

  const [isOpen, setIsOpen] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
    console.log(toggleState);
  }

  return (
    <div className="flex">
     
    <>
    {!isOpen ? 
        (
        <button onClick={()=>setIsOpen(!isOpen)} className="fixed top-0 right-0 pr-5">
                
                <FaBars  size="20"/>

        </button>
        
        
        
        ):
        (
                    <button className="fixed z-20 hidden lg:block top-6 left-16" onClick={()=>setIsOpen(!isOpen)}>
                    <FaArrowLeft size="20" color="cyan"/>
                    </button>
           
        )
    }
    <div className={`top-0 left-0 lg:block hidden h-screen m-0 text-center z-10 bg-gray-900 shadow-lg w-1/10 text-cyan-400 ${isOpen ? 'translate-x-0': '-translate-x-full'} ease-in-out duration-300`}>
        
        
        <div className="flex-grow mx-2 mt-16 mb-20">

                
                <button onClick={() => toggleTab(1)}>
                <SideBarIcon icon={<FaBriefcase size="20" />} text={"JOBS"}/>
                </button>
                
                <button onClick={() => toggleTab(2)}>
                <SideBarIcon icon={<FaIdCard size="20" />} text={"TALENT"}/>
                </button>

                <button onClick={() => toggleTab(3)}>
                <SideBarIcon icon={<FaNetworkWired size="20" />} text={"CONNECTIONS"}/>
                </button>
            
        </div>
        
        <button onClick={() => toggleTab(4)}>
        <ProfileIcon icon={<FaUser size="40" />}/>
        </button>

</div>
    </>
      <div>
        <div className="w-full py-4 text-xl text-center bg-gray-900 text-cyan-400">
            Neo Tokyo Directory 
        </div>

       <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${toggleState===1 ? "block" : "hidden"}`}>
          <div className="grid grid-flow-col auto-cols-max">
            <JobCard title="Webdev job" user="user1"></JobCard>
            <JobCard title="Marketing job" user="user2"></JobCard>
            <JobCard title="Artist job" user="user3"></JobCard>
          </div>
       </div>

       <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${toggleState===2 ? "block" : "hidden"}`}>
          <div className="grid grid-flow-col auto-cols-max">
            <InfoCard user="user1"></InfoCard>
            <InfoCard user="user2"></InfoCard>
            <InfoCard user="user3"></InfoCard>
          </div>
       </div>

       <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${toggleState===3 ? "block" : "hidden"}`}>
          <div className="grid grid-flow-col auto-cols-max">
            <InfoCard user="user1"></InfoCard>
            <InfoCard user="user2"></InfoCard>
            <InfoCard user="user3"></InfoCard>
          </div>
       </div>

       <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${toggleState===4 ? "block" : "hidden"}`}>
            profile
       </div>
       </div>
    </div>
  )
}

const ProfileIcon = ({icon}) => (

  <footer className="fixed hidden lg:block bottom-6 left-14 hover:bg-cyan-700 hover:rounded-md"> 
  
      {icon}
  
  </footer>
  
  
  )

  const SideBarIcon = ({icon, text}) => (
    <div className="w-full px-2 py-8 hover:bg-cyan-700 hover:rounded-md">
        <div className="px-12"> 
            
                {icon}
          

        </div>
        <div className="">{text}</div>
    </div>  
)

const JobCard = ({title, user}) => (

  <div className="max-w-sm overflow-hidden rounded shadow-lg">
  <div className="px-6 py-4">
    <div className="text-xl font-bold">{title}</div>
    <p className="text-sm">{user}</p>
    <p className="text-base text-gray-500">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
    </p>
    
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">Dev</span>
    <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">Nextjs</span>
    <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">Tailwind</span>
  </div>
</div>
  
  )

  const InfoCard = ({user}) => (

    <div className="max-w-sm overflow-hidden rounded shadow-lg">
    <div className="px-6 py-4">
      <div className="text-xl font-bold">{user}</div>     
      <p className="text-base text-gray-500">
        -Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
        -Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
      </p>
      
    </div>
    <div className="px-6 pt-4 pb-2">
      <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">Dev</span>
      <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">Nextjs</span>
      <span className="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full">Tailwind</span>
    </div>
  </div>
    
    )