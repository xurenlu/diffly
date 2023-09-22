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
    const [popup, setPopup] = useState(false);

    const toastMsg = ()=>{
        console.log("onFinished called");
        toast({
            title: "execute done",
            description: "execution finished.",
            status: "success",
            duration: 3000,
        })
    }
    useEffect(() => {

    }, []);
    const ppp = ()=>{
        console.log("hey")
        setPopup(!popup)

    }
    return <>

        <div style={{position:"fixed",top:"0px",width:"100%"}} >
           <MultiStepProgress onFinish={toastMsg} name={jobName} />
        </div>
  </>
}
