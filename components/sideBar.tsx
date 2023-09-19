import {
    Button,
    Input,
    InputGroup, InputLeftAddon,
    InputLeftElement,
    InputRightElement,
    Select,
    Textarea,
    useToast
} from "@chakra-ui/react";
import styles from './styles/itemStyle.module.css'
import {useEffect, useState} from "react";
import {VscDebugConsole} from 'react-icons/vsc'

import CopyToClipboard from '@uiw/react-copy-to-clipboard';
import {PiArrowLeftBold,PiArrowRightBold} from "react-icons/pi";
import {FaLink} from "react-icons/fa";
import {BiSolidCopy} from 'react-icons/bi'

interface ItemType {
    id: number;
    cookie:string;
    uri:string;
    chosen?:string;
    old_debug?:string;
    new_debug?:string;

}
interface SideBarProps {
    onChange:(id:number)=>void;
}
export  function SideBar(props:SideBarProps) {
    const toast = useToast()
    const {onChange} = props;
    const [logs, setLogs] = useState([]);
    const [items, setItems] = useState([]);
    const handle = async () => {
        const resp = await fetch("/api/json_diff/groups");
        let temp =  await resp.json();
        setLogs(temp)
        const diffResp = await fetch("/api/json_diff/index");
        let t =  await diffResp.json();
        setItems(t);
    }
    useEffect(() => {
        handle()
    }, []);
    const click = (id:number)=>{
        if(onChange){
            onChange(id)
        }
    }
    const clear = ()=>{
        fetch("/api/json_diff/clear",{
            method:"POST"
        }).then(()=>{}).then(()=>{
            toast({
                title: "clear success",
                description: "your api-visits has been cleared.",
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
    const all = ()=>{
        fetch("/api/json_diff/all",{
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
    const copied=()=>{

        toast({
            title: "copy success",
            description: "your link has been copied to clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,

        })
    }
    return (
        <div style={{minHeight:"400px",height:"800px",overflow:"scroll"}} className={"p-2"}>

            { /**
            <Select placeholder="Select option">
                <option value={''}>choose group first</option>
                {logs.map((log: any) => <option key={log} value={log}>{log}</option>)}
            </Select>

            <div style={{display:"flex"}} className={"p-1"}>
                <div style={{flex:"1"}}>
                    <Button colorScheme={"whatsapp"} onClick={clear}>
                        Clear api-visits
                    </Button>
                </div>
                <div style={{flex:"1"}}>
                    <Button colorScheme={"facebook"} onClick={execute}>
                        Execute batch api visits
                    </Button>
                </div>
            </div> */ }

            <div style={{display:"flex"}} className={""}>
                <Button style={{width:"99%"}} colorScheme={"blue"} onClick={all}>
                    clear and execute
                </Button>

            </div>

            <ul>
                {items.map((item: ItemType) => <li
                    style={{width:"100%"}}
                    className={styles.logItem +" border-solid border-indigo-600 p-8 mb-4 mt-4  " + (item.chosen=='y'?"bg-gray-500":" ")} key={item.id} onClick={() => {
                    if(item.chosen=='y'){
                        item.chosen=''
                    }else{
                        item.chosen = 'y'
                    }
                    click(item.id)
                } }>
                    {item.id},
                    <div style={{width:"90%",margin:"3px auto"}}>
                        <InputGroup>
                            <InputLeftAddon>
                                <PiArrowLeftBold size={16} />

                            </InputLeftAddon>
                            <Input colorScheme={"whatsapp"} size="md" value={"old_debug:"+item.old_debug} />
                            <InputRightElement>
                                <CopyToClipboard  text={item.old_debug}
                                                  onClick={copied}>
                                    <BiSolidCopy className={styles.svgIcon} size={20}/>
                                </CopyToClipboard>
                            </InputRightElement>
                        </InputGroup>



                    </div>

                    <div style={{width:"90%",margin:"3px auto"}}>
                        <InputGroup>
                        <InputLeftAddon>
                            <PiArrowRightBold size={16} />
                        </InputLeftAddon>
                        <Input size="md" value={"new debug:"+item.new_debug} />
                            <InputRightElement>
                                <CopyToClipboard  text={item.new_debug}
                                                  onClick={copied}>
                                    <BiSolidCopy className={styles.svgIcon} size={20}/>
                                </CopyToClipboard>
                            </InputRightElement>
                        </InputGroup>
                    </div>

                    <div style={{width:"90%",margin:"3px auto"}}>
                        <InputGroup>
                            <InputLeftAddon>
                               <FaLink size={16} />
                            </InputLeftAddon>
                            <Input size="md" value={"url:"+item.uri} />
                            <InputRightElement>
                                <CopyToClipboard  text={item.uri}
                                                  onClick={copied}>
                                    <BiSolidCopy className={styles.svgIcon} size={20}/>
                                </CopyToClipboard>
                            </InputRightElement>
                        </InputGroup>

                    </div>

                    <div style={{width:"90%",margin:"3px auto"}}>
                        <InputGroup>
                            <InputLeftAddon>
                            <VscDebugConsole size={16} />
                            </InputLeftAddon>
                            <Input size="md" value={"cookie:"+item.cookie} />
                            <InputRightElement>
                                <CopyToClipboard  text={item.cookie}
                                                  onClick={copied}>
                                    <BiSolidCopy className={styles.svgIcon} size={20}/>
                                </CopyToClipboard>
                            </InputRightElement>
                        </InputGroup>
                    </div>

                </li>)}
            </ul>

        </div>
    )
}
