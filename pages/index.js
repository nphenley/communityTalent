import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import { FaIdCard, FaNetworkWired, FaBriefcase, FaUser, FaBars, FaArrowLeft  } from "react-icons/fa";
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { collection, doc, getDoc, getDocs, where, query  } from "firebase/firestore"; 

initializeApp({
  apiKey: "AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0",
  authDomain: "talent-d15b4.firebaseapp.com",
  projectId: "talent-d15b4",
  storageBucket: "talent-d15b4.appspot.com",
  messagingSenderId: "691000709770",
  appId: "1:691000709770:web:71617ce4d81358cdd35373",
  
})

const db = getFirestore();



export default function Home() {

  const [isOpen, setIsOpen] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
    console.log(toggleState);
  }

  const [isConnected, setIsConnected] = useState(false);
  
  const [jobs, setJobs] = useState([]);
  const jobsCollectionRef = collection(db, "jobs");
  
  useEffect(()=> {
    const getJobs = async () => {
      const data = await getDocs(jobsCollectionRef);
      setJobs(data.docs.map((doc)=> ({...doc.data(),id: doc.id})));
    };
    getJobs();
  }, []);

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
        <div className="w-screen py-4 text-xl text-center bg-gray-900 text-cyan-400">
            Neo Tokyo Directory
            <button onClick={() => setIsConnected(true)} className={`absolute top-5 right-8 text-base ${isConnected ? "hidden" : "block"}`}>
                Connect  
            </button>
            <button onClick={() => setIsConnected(false)} className={`absolute top-5 right-8 text-base ${isConnected ? "block" : "hidden"}`}>
                Connected  
            </button>  
        </div>

        <>
        <div className={`flex bg-gray-800 h-screen text-xl ${isConnected ? "hidden" : "block"}`}>
                <div className='m-auto'>
                    nada
                </div>
                
        </div>
        </>
        <div className={`${isConnected ? "block" : "hidden"}`}>

            

            <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${(toggleState===1 && isConnected) ? "block" : "hidden"}`}>
                <div className="grid grid-flow-col auto-cols-max">
                  {jobs.map((job)=> {
                      return(
                        <JobCard title={job.title} user={job.user} description={job.description} tags={job.tags}></JobCard>
                      );
                    })
                  }
                  
                </div>
            </div>

            <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${(toggleState===2 && isConnected) ? "block" : "hidden"}`}>
                <div className="grid grid-flow-col auto-cols-max">
                  <InfoCard user="user1"></InfoCard>
                  <InfoCard user="user2"></InfoCard>
                  <InfoCard user="user3"></InfoCard>
                </div>
            </div>

            <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${(toggleState===3 && isConnected) ? "block" : "hidden"}`}>
                <div className="grid grid-flow-col auto-cols-max">
                  <InfoCard user="user1"></InfoCard>
                  <InfoCard user="user2"></InfoCard>
                  <InfoCard user="user3"></InfoCard>
                </div>
            </div>

            <div className={`w-screen h-screen bg-gray-800 text-cyan-50 ${(toggleState===4 && isConnected) ? "block" : "hidden"}`}>
                  profile
            </div>
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

const JobCard = ({title, description, tags, user}) => (

  <div className="relative w-64 my-2 ml-2 overflow-hidden bg-gray-900 rounded shadow-lg h-72">
  <div className="px-6 py-4">
    <div className="text-xl font-bold">{title}</div>
    <p className="text-sm">{user}</p>
    <p className="text-base text-gray-500">
      {description}
    </p>
    
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${tags[0]===true ? "block" : "hidden"}`}>Dev</span>
    <span className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${tags[1]===true ? "block" : "hidden"}`}>Marketing</span>
    <span className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${tags[2]===true ? "block" : "hidden"}`}>Art</span>
  </div>
</div>
  
  )

  const InfoCard = ({user}) => (

    <div className="max-w-sm my-2 ml-2 overflow-hidden bg-gray-900 rounded shadow-lg">
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