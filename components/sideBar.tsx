import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    Select,
    Stack,
    Textarea,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import styles from './styles/itemStyle.module.css'
import {useEffect, useRef, useState} from "react";
import {VscDebugConsole} from 'react-icons/vsc'
import {configureAbly, useChannel} from "@ably-labs/react-hooks";

import CopyToClipboard from '@uiw/react-copy-to-clipboard';
import {PiArrowLeftBold, PiArrowRightBold} from "react-icons/pi";
import {FaLink} from "react-icons/fa";
import {BiBoltCircle, BiSolidCopy} from 'react-icons/bi'
import {BsDatabaseFillAdd,BsPlusSlashMinus} from 'react-icons/bs'
import {CgArrowsMergeAltV, CgArrowsShrinkV} from 'react-icons/cg'
import Image from "next/image";
import {FocusableElement} from "@chakra-ui/utils";
import {Xprogress} from "@/components/xprogress";


interface ItemType {
    id: number;
    cookie:string;
    uri:string;
    chosen?:string;
    old_debug?:string;
    new_debug?:string;
    score?:number;

}
interface SideBarProps {
    onChange:(id:number)=>void;
    height?:string;
}
export  function SideBar(props:SideBarProps) {
    const toast = useToast()
    const {onChange,height} = props;
    const [groupId,setCurrentGroupId] = useState("");
    const [endPoints, setEndPoints] = useState([]);
    const [items, setItems] = useState([]);
    const [accessLog, setAccessLog] = useState("");
    const [activeId, setActiveId] = useState(0);
    const [jobName,setJobName] = useState("");
    //control drawer
    const { isOpen, onOpen, onClose } = useDisclosure()
    //const btnRef = useRef()
    const btnRef: React.MutableRefObject<FocusableElement | null | undefined> = useRef()
    const handle =  () => {
         fetch("/api/v3/groups").then((resp:any)=>{ return resp.json()})
            .then((data:any)=>{
                console.log("endpoints:",data)
                setEndPoints(data)
            })
    }

    configureAbly({ key: "r_fSNQ.NOV6Xg:N9Ao_SuWHzm2k5YY1uiJ2_KVPsOPUsVj53fuBzS249c"});
    /**
     * 每当ably的end_points频道有消息时，就会触发这个回调，更新items。
     */
    const [channel, ably] = useChannel('endpoints', (msg) => {
        console.log("new msg,",msg)
        if(groupId && msg.data== groupId){
            fetch("/api/v3/json_diff/index?end_point_id=" + groupId).then((resp: any) => {
                return resp.json()
            })
                .then((data: any) => {
                    setItems(data);
                    toast({
                        title: "数据已经更新",
                        description: "数据已经更新",
                        status: "success",
                        duration: 3000
                    })
                });
        }
    });


    useEffect(() => {
        handle()
    }, []);
    const click = (id:number)=>{
        console.log("id",id)
        console.log("onChange",onChange)
        if(onChange){
            onChange(id)
        }
    }
    const clear = ()=>{
        fetch("/api/json_diff/clear",{
            method:"POST"
        }).then(()=>{}).then(()=>{
            toast({
                title: "任务已经提交",
                description: "已经提交了异步任务",
                status: "success",
                duration: 3000,
            })
        })
    }
    const execute= ()=>{

        fetch("/api/json_diff/execute",{
            method:"POST"
        }).then(()=>{}).then(()=>{
            toast({
                title: "execute done",
                description: "execution finished.",
                status: "success",
                duration: 3000,
            })
        })
    }
    const rerun30 = ()=>{
        fetch("/api/v3/json_diff/rerun10?end_point_id="+groupId,{
            method:"POST"
        }).then((resp:any)=>{ return resp.json() }).then((data)=>{
            let jobName = data.job;
            console.log("jobId:",jobName)
            setTimeout(()=>{
                setJobName(jobName)
            },1000)
            toast({
                title: "任务已经提交",
                description: "已经提交了异步任务",
                status: "success",
                duration: 3000,
            })
        })
    }
    const all = ()=>{
        fetch("/api/v3/json_diff/clear_and_go?end_point_id="+groupId,{
            method:"POST"
        }).then((resp:any)=>{ return resp.json() }).then((data)=>{
            let jobName = data.job;
            console.log("jobId:",jobName)
            setTimeout(()=>{
                setJobName(jobName)
            },1000)
            toast({
                title: "任务已经提交",
                description: "已经提交了异步任务",
                status: "success",
                duration: 3000,
            })
        })
    }
    const copied=()=>{

        toast({
            title: "copy success",
            description: "your link has been copied to clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,

        })
    }

    const postHttpLog= ()=>{
        const formData = new FormData()
        formData.append("body",accessLog)
        fetch("/api/v3/http_log/new",{
            method:"POST",
            body:formData
        }).then(()=>{}).then(()=>{
            toast({
                title: "post success",
                description: "数据提交成功.",
                status: "success",
                duration: 2000,
                isClosable: true,
                position:"top"
            })
            setTimeout(()=>{
                onClose()
            },500)
        })
    }
    const load4group = (event:any)=>{
        const val = event.target.value;
        setCurrentGroupId(val);
        if(val){
                fetch("/api/v3/json_diff/index?end_point_id="+val).then((resp:any)=>{ return resp.json()})
                    .then((data:any)=>{
                        setItems(data);
                    });
        }
    }
    const activeIt = (id:number)=>{
        console.log("active it:",id)
        setActiveId(id)
    }
    const unActiveIt = (id:number)=>{
        console.log("deactive:",id)
        setActiveId(0)
    }
    const updateLogs = (evt:any) => {
        console.log("values:",evt.target.value)
        setAccessLog(evt.target.value)
    }
    // @ts-ignore
    return (
        <div style={{zIndex:"999",position:"fixed",top:"1px",left:"1px",minWidth:"300px"}}>
            <Xprogress jobName={jobName} />
            <div style={{flex: "1",display:"flex",flexDirection:"row"}} className={"pl-2 pt-2"}>
                <Image src={"/logo4.png"} alt={"log"} width={64} height={64} />
            </div>
        <div style={{minHeight:"500px",height:height,overflowY:"auto"}} className={"p-2"}>

            <Select placeholder="choose endpoint first" onChange={load4group}>
                {endPoints.map((log: any) => <option key={log.id} value={log.id}>{log.path}</option>)}
            </Select>




            <ul>
                {items.map((item: ItemType) => <li
                    style={{width:"100%"}}
                    className={styles.logItem +" border-solid border-indigo-600 p-4  " + (item.chosen=='y'?"bg-gray-500":" ")}
                    key={item.id}
                >
                    <div style={{width:"90%",margin:"2px auto"}} >
                        <InputGroup >
                            <InputLeftElement>
                                {item.id}
                            </InputLeftElement>
                            <Input defaultValue={item.uri} variant={"ghost"} onClick={ ()=> click(item.id) }/>
                            <InputRightAddon>

                                { item.id==activeId ?

                                    <CgArrowsMergeAltV size={20} style={{cursor:"pointer"}} onClick={ ()=> unActiveIt(item.id)}/>:
                                    <CgArrowsShrinkV size={20} style={{cursor:"pointer"}} onClick={ ()=> activeIt(item.id)}/>
                                }
                            </InputRightAddon>
                        </InputGroup>
                    </div>
                    {item.id == activeId ?
                    <div >

                        <div style={{width:"90%",margin:"3px auto"}}>

                            <InputGroup>
                                <InputLeftElement>
                                    <BsPlusSlashMinus size={16} />

                                </InputLeftElement>
                                <Input colorScheme={"whatsapp"} size="md" style={{border:"none"}} value={"diff_score:"+item.score} />
                            </InputGroup>
                        </div>


                        <div style={{width:"90%",margin:"3px auto"}}>

                            <InputGroup>
                                <InputLeftElement>
                                    <PiArrowLeftBold size={16} />

                                </InputLeftElement>
                                <Input colorScheme={"whatsapp"} size="md" style={{border:"none"}} value={"old_debug:"+item.old_debug} />
                                <InputRightAddon style={{border:"none"}} background={"none"}>
                                    <CopyToClipboard  text={item.old_debug}
                                                      onClick={copied} background={"none"}>
                                        <BiSolidCopy className={styles.svgIcon} size={20}/>
                                    </CopyToClipboard>
                                </InputRightAddon>
                            </InputGroup>
                        </div>

                        <div style={{width:"90%",margin:"3px auto"}}>
                            <InputGroup>
                                <InputLeftElement>
                                    <PiArrowRightBold size={16} />
                                </InputLeftElement>
                                <Input size="md" style={{border:"none"}} value={"new debug:"+item.new_debug} />
                                <InputRightAddon style={{border:"none"}} background={"none"}>
                                    <CopyToClipboard  text={item.new_debug}
                                                      onClick={copied} background={"none"}>
                                        <BiSolidCopy className={styles.svgIcon} size={20}/>
                                    </CopyToClipboard>
                                </InputRightAddon>
                            </InputGroup>
                        </div>

                        <div style={{width:"90%",margin:"3px auto"}}>
                            <InputGroup>
                                <InputLeftElement>
                                    <FaLink size={16} />
                                </InputLeftElement>
                                <Input size="md" style={{border:"none"}} value={"url:"+item.uri} />
                                <InputRightAddon style={{border:"none"}} background={"none"}>
                                    <CopyToClipboard  text={item.uri}
                                                      onClick={copied} background={"none"}>
                                        <BiSolidCopy className={styles.svgIcon} size={20}/>
                                    </CopyToClipboard>
                                </InputRightAddon>
                            </InputGroup>

                        </div>

                        <div style={{width:"90%",margin:"3px auto"}}>
                            <InputGroup>
                                <InputLeftElement>
                                    <VscDebugConsole size={16} />
                                </InputLeftElement>
                                <Input size="md" style={{border:"none"}} value={"cookie:"+item.cookie} />
                                <InputRightAddon style={{border:"none"}} background={"none"}>
                                    <CopyToClipboard  text={item.cookie}
                                                      onClick={copied}>
                                        <BiSolidCopy className={styles.svgIcon} size={20}/>
                                    </CopyToClipboard>
                                </InputRightAddon>
                            </InputGroup>
                        </div>

                    </div>
                    :<></>}

                </li>)}
            </ul>

        </div>

            <Stack direction='row' spacing={4} className={"p-2"}>
                <Button
                    onClick={onOpen} colorScheme={"blue"}
                    className={"mr-2"}
                    leftIcon={
                <BsDatabaseFillAdd size={20} ref={btnRef}  />}
                    />
                <Button leftIcon={<BiBoltCircle size={24}/>} style={{width:"40%"}} colorScheme={"yellow"} onClick={all}>
重跑
                </Button>

                <Button leftIcon={<BiBoltCircle size={24}/>} style={{width:"40%"}} colorScheme={"teal"} onClick={rerun30}>
                    重跑(top30)
                </Button>
            </Stack>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}

            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>粘贴csv格式的access log</DrawerHeader>

                    <DrawerBody>
                        <Textarea placeholder='Paste here...' rows={12} onChange={ updateLogs}
                        />
                        nginx配置提示:
                        <pre>
                        log_format csv_log &apos;$http_cookie^^^^$request_uri&apos;;</pre>
                        <pre>
                        access_log  /var/log/nginx/access.log  csv_log;
                        </pre>



                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={postHttpLog}>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>


            </div>
    )
}
