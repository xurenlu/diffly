'use client'
import {ChakraProvider, Checkbox, Progress, Text} from "@chakra-ui/react";
import {SideBar} from "@/components/sideBar";
import {diff, formatters} from "jsondiffpatch"
import 'jsondiffpatch/dist/formatters-styles/html.css'
import 'jsondiffpatch/dist/formatters-styles/annotated.css'
import {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {IoNotificationsSharp} from "react-icons/io5";
import {Xprogress} from "@/components/xprogress";

export default  function Home() {
    const [html, setHtml] = useState("");
    const [showUnchanged, setShowUnchanged] = useState(false);
    //const
    const handle = async (id:number) => {
        const resp = await fetch("/api/json_diff/view/"+id+"?rnd="+Math.random());
        const data = await resp.json();
        console.log("data,",data)
        const delta = diff(data.old_body, data.new_body);
        if (delta) {
            console.log("delta:",delta)
            const temp = formatters.html.format(delta, data.old_body);
            formatters.html.showUnchanged(false)
            setHtml(temp)
        }
    }
    const changed = (evt:any)=>{
        setShowUnchanged(evt.target.checked)
        formatters.html.showUnchanged(evt.target.checked)
    }
    // @ts-ignore
    useEffect(() => {

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
        handle(id)
    }
    // const resp = await fetch(BACKEND_URL+"/api/json_diff/view/4?rnd="+Math.random());
    // const data = await resp.json();
    // console.log("data,",data)
    // const delta = diff(data.old_body, data.new_body);
    const getDocumentWidth = ()=>{
        return document.documentElement.clientWidth;
    }
        return (

            <ChakraProvider>
                <Xprogress/>

                <div style={{display: "flex", minWidth: "800px"}}>
                    <div style={{flex: "1"}} className={"pl-2 pt-2"}>
                        <Image src={"/logo4.png"} alt={"log"} width={64} height={64} />
                    </div>
                    <div style={{flex:"4",verticalAlign:"bottom"}} className={"relative"} >
                        {/** verical align bottom **/}
                        <Text fontSize="4xl" className={"absolute inset-x-0 bottom-0"} color="blue.500" style={{margin: "0 auto"}}>Api diff</Text>
                    </div>

                </div>
                <div style={{display: "flex", minWidth: "800px"}}>
                    <div style={{width: "30%"}}>

                        <SideBar onChange={updateId}/>
                    </div>
                    <div style={{width: "70%"}} className={"p-2"}>
                        <Checkbox onChange={changed} defaultIsChecked={showUnchanged}>show unchanged property</Checkbox>
                        <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>

                    </div>
                </div>


            </ChakraProvider>

        )
}
