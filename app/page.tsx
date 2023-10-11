'use client'
import {ChakraProvider, Spinner, Text, Tooltip, useToast} from "@chakra-ui/react";
import {SideBar} from "@/components/sideBar";
import {diff, formatters} from "jsondiffpatch"
import 'jsondiffpatch/dist/formatters-styles/html.css'
import 'jsondiffpatch/dist/formatters-styles/annotated.css'

import {AiFillEyeInvisible, AiOutlineEyeInvisible, AiOutlineRedo} from "react-icons/ai";
import {useEffect, useState} from "react";

import {BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs"


export default  function Home() {
    const toast = useToast()

    const [html, setHtml] = useState("");
    const [showUnchanged, setShowUnchanged] = useState(false);
    const [chosenId,setChosenId] = useState("");
    const [result,setResult] = useState({} as any);
    const [marked,setMarked] = useState(false);
    const [undoing,setUndoing] = useState(false);

    const toastSucc = (title:string,msg:string)=>{
        toast({
            title: title,
            description: msg,
            status: "success",
            duration: 3000,
            isClosable: true,
        })
    }
    const toastError = (title:string,msg:string)=>{
        toast({
            title: title,
            description: msg,
            status: "error",
            duration: 3000,
            isClosable: true,
        })
    }
    //const
    const handle = async (id:number) => {
        setChosenId(id+"")
        const resp = await fetch("/api/v3/json_diff/view/"+id+"?rnd="+Math.random());
        const data = await resp.json();
        setResult(data)
        setMarked(data.mark)
        console.log("data,",data)
        const delta = diff(data.old_body, data.new_body);
        if (delta) {
            console.log("delta:",delta)
            const temp = formatters.html.format(delta, data.old_body);
            formatters.html.showUnchanged(showUnchanged)
            setHtml(temp)
        }
    }
    const changed = (evt:any)=>{
        setShowUnchanged(evt.target.checked)
        formatters.html.showUnchanged(evt.target.checked)
    }
    const showChanged = ()=>{
        console.log("showChanged")
        setShowUnchanged(true)
        formatters.html.showUnchanged(true)
    }
    const hideChanged = ()=>{
        console.log("hide changed")
        setShowUnchanged(false)
        formatters.html.showUnchanged(false)
    }
    const markIt = async ()=>{
        const resp = await fetch("/api/v3/json_diff/mark?id="+chosenId+"&rnd="+Math.random(),{
            method:"POST"
        });
        const data = await resp.json();
        setMarked(true)
    }
    const unmarkIt = async ()=>{
        const resp = await fetch("/api/v3/json_diff/unmark?id="+chosenId+"&rnd="+Math.random(),{
            method:"POST"
        });
        const data = await resp.json();
        setMarked(false)
    }

    const redo = async ()=> {
        setUndoing(true)
        try {
            const resp = await fetch("/api/v3/json_diff/redo/" + chosenId + "?rnd=" + Math.random(), {
                method: "POST"
            });
            const data = await resp.json();
            setUndoing(false)
            toastSucc("redo success","redo success. reloading...")
            await handle(chosenId)
        }catch (e){
            setUndoing(false)
            toastError("redo failed","redo failed. ")
        }
    }


    const [height, setHeight] = useState(500);
    const [width, setWidth] = useState(800);
    const handleResize = ()=>{
        setHeight(document.documentElement.clientHeight);
        setWidth(document.documentElement.clientWidth);
    }
    // @ts-ignore
    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
        window.addEventListener('scroll', function() {
        //     const myDiv = document.getElementById('prog');
        //     console.log("pageYOffset:",window.pageYOffset);
        //     // 判断页面滚动的距离是否超过了 div 元素的顶部位置
        //     // @ts-ignore
        //     if (window.pageYOffset > myDiv.offsetTop) {
        //         // 如果超过了，将 div 元素的样式中的 position 属性设置为 fixed，top 属性设置为 0
        //         // @ts-ignore
        //         myDiv.style.position = 'fixed';
        //         // @ts-ignore
        //         myDiv.style.top = '0';
        //
        //     } else {
        //         // 如果没有超过，将 div 元素的样式中的 position 和 top 属性都设置为空
        //         // @ts-ignore
        //         myDiv.style.position = '';
        //         // @ts-ignore
        //         myDiv.style.top = '';
        //     }
        });
    },[])

    const updateId = (id:number)=>{
        console.log("id,",id)
        handle(id).then(()=>{
            console.log("handle done")
        })
    }
    const getDocumentWidth = ()=>{
        return document.documentElement.clientWidth;
    }
        return (

            <ChakraProvider>



                <div style={{display: "flex", minWidth: "1080px"}}>
                    <div style={{width: "30%"}}>

                        <SideBar onChange={updateId} height={(height-144)+"px"}/>
                    </div>
                    <div style={{width: "70%"}} className={"p-2"}>
                        {html?
                        <div style={{display:"flex",justifyContent:"flex-end",gap:"10px"}} >

                            {chosenId?
                                <Text style={{}}>id:{chosenId}</Text>:<></>}


                            {undoing?<Spinner size='xs' />:
                            <AiOutlineRedo size={20} style={{cursor:"pointer"}} onClick={redo}/> }



                            <Tooltip label='bookmark current diff'>
                            {marked?
                            <BsBookmarkCheckFill size={20} onClick={unmarkIt} style={{cursor:"pointer",color:"yellow"}} />:
                            <BsBookmarkCheck size={20} onClick={markIt} style={{cursor:"pointer",color:"gray"}}/>
                            }
                            </Tooltip>

                            {showUnchanged?
                             <AiFillEyeInvisible size={20} style={{cursor:"pointer",color:"yellow"}} onClick={hideChanged}/>:
                                <AiOutlineEyeInvisible size={20}  style={{cursor:"pointer",color:"gray"}} onClick={showChanged}/>
                            }


                        </div>

                            :
                            <></>
                        }

                        <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>

                    </div>
                </div>




            </ChakraProvider>

        )
}
