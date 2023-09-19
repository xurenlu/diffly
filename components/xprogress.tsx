'use client'
import {motion} from "framer-motion";
import {IoNotificationsSharp} from "react-icons/io5";
import {Progress, Button,useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
} from '@chakra-ui/react'
import {pop} from "@jridgewell/set-array";


export function Xprogress(){
    const toast = useToast()
    const [popup, setPopup] = useState(false);
    const [value, setValue] = useState(0);
    const [done, setDone] = useState(false);
    const toastMsg = ()=>{
        toast({
            title: "execute done",
            description: "execution finished.",
            status: "success",
            duration: 3000,
        })
    }
    useEffect(() => {
       let  timer = setInterval(() => {
            setValue((v) => {
                if (v >= 100) {
                    clearInterval(timer);
                    setDone(true)
                    toastMsg()
                    return 100;
                }
                return v + 30;
            });
        },100)

    }, []);
    const ppp = ()=>{
        console.log("hey")
        setPopup(!popup)

    }
    return <>

    { done?
    <div style={{position:"relative"}}>
        <div style={{zIndex:"999",position:"absolute",top:"1px",right:"30px"}} id={"process-icon"}>
            <Popover isOpen={popup}>
                <PopoverTrigger>
                    <motion.div
                        whileHover={{ scale: 1.3 }}
                        animate={{
                            y:[1,20,1],
                            scale: [1,1.5,1],
                            rotate: [0,180,360],
                            opacity: [0.3,0.7,1],
                        }}
                        transition={{
                            duration:0.7
                        }}
                    >

                        <IoNotificationsSharp size={24} onClick={ ppp }/>
                    </motion.div>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton onClick={ ()=> setPopup(false)}/>
                    <PopoverHeader>Confirmation!</PopoverHeader>
                    <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
                </PopoverContent>
            </Popover>


        </div>
    </div>
        :
    <div>
        <div style={{position:"fixed",top:"0px",width:"100%"}} id={"prog"}>
            <Progress hasStripe  colorScheme={"whatsapp"} value={value} style={{height:"3px"}} className={"bg-orange-100"}>
            </Progress>
        </div>
    </div>
    }
        </>
}
