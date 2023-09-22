'use client'
import {useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import MultiStepProgress from "@/components/multiStepProgress";

interface XProgressProps {
jobName?:string;
}

export function Xprogress(props:XProgressProps){
    const toast = useToast()
    const {jobName} = props;
    const [done,setDone] = useState(false)
    const [popup, setPopup] = useState(false);
    let toastId:any;
    const finished = ()=>{
        console.log("onFinished called");
        if(!done){
            toastId = toast({
            title: "Job Finished.",
            description: "async job finished.",
            status: "success",
            duration: 3000,
            id:toastId
            })
        }
        setDone (true)
    }
    useEffect(() => {
        setDone(false)
    }, []);
    return <>
        {done?<></>:
        <div style={{position:"fixed",top:"0px",width:"100%"}} >
           <MultiStepProgress onFinish={finished} name={jobName} />
        </div>
        }
  </>
}
