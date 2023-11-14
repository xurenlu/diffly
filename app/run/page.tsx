'use client'
import {
    ChakraProvider, FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    InputRightElement, Select, Text,
    Radio, RadioGroup, Stack, FormLabel, Textarea, Button, Spinner,useToast,
    useTooltip
} from "@chakra-ui/react";
import HeaderNav from "@/components/headerNav";
import {useState} from "react";
import {JsonViewer} from "@textea/json-viewer";
import {BsFillArrowUpCircleFill} from "react-icons/bs";

export default function RunPage(){
    const toast = useToast()
    const [method,setMethod] =useState("get")
    const [loading,setLoading] = useState(false)

    const [host,setHost]=useState("https://crm.mbimc.com")
    const [uri,setUri]=useState("/")
    const [body,setBody] = useState("")
    const [result,setResult] = useState({} as any)
    const [cookie,setCookie] = useState("")
    const doHttp = ()=>{
        setLoading(true)
        setResult({})
        fetch("/api/v3/manual/api",{
            method:"POST",
            mode:"cors",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            body:JSON.stringify({
                url:host+uri,
                m:method,
                body:body,
                cookie:cookie
            })
        }).then((resp)=> resp.json()).then(data=>{
            console.log("data:",data)
            setLoading(false)
            setResult(data)
        }).catch(err=>{
            console.log("err:",err)
            setLoading(false)
            toast({
                title: "error",
                description: err.toString(),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        })
    }
    return <ChakraProvider>
        <HeaderNav/>
        <Text fontSize={"2xl"} className={"content-center center text-center"}>HandMade</Text>

        <form className={"m-4 p-8"}>
            <FormControl>
                <InputGroup>
                    <InputLeftElement>
                        <Select style={{width: "300px", paddingLeft: "30px"}}
                                onChange={(event: any) => setHost(event.target.value)}>
                            <option value="https://crm.mbimc.com" selected>https://crm.mbimc.com/</option>
                            <option value={"http://jcrm.biying88.cn:9090"}>
                                http://jcrm.biying88.cn:9090
                            </option>
                        </Select>
                    </InputLeftElement>

                    <Input placeholder="URL" style={{marginLeft: "300px"}}
                           onChange={(e: any) => setUri(e.target.value)}/>

                </InputGroup>
            </FormControl>

            <FormControl className={"mt-4"}>
                <FormLabel>
                    Cookie:
                </FormLabel>
                <Textarea placeholder={"cookie"} rows={3} cols={100}
                          onChange={e => setCookie(e.target.value)}></Textarea>
            </FormControl>

            <FormControl className={"m-4"}>
                <RadioGroup defaultValue='get' onChange={setMethod}>
                    <Stack spacing={5} direction='row'>
                        <Radio colorScheme='red' value='get'>
                            GET
                        </Radio>
                        <Radio colorScheme='green' value='post'>
                            POST
                        </Radio>
                    </Stack>
                </RadioGroup>
            </FormControl>

            {method == "post" ?
                <FormControl>
                    <Textarea rows={5} cols={100} placeholder={"body"}
                              onChange={(event: any) => setBody(event.target.value)}/>
                </FormControl> : <></>}
            <FormControl className={"m-2"}>
                <Button colorScheme={"teal"} className={"w-64"} variant={"outline"}
                        leftIcon={<BsFillArrowUpCircleFill size={24}/>} onClick={doHttp}>submit</Button>
            </FormControl>
        </form>

        {loading ?
            <div className="m-2 text-center center">
                <Spinner size="xl"/>
            </div> : <></>}
        {result && Object.keys(result).length > 0 ?
            <div className="m-10">
                <Text fontSize={"2xl"} className={"text-center m-2"}> result</Text>
                <JsonViewer value={result} theme="dark" className={"p-8"}/>
            </div> : <></>
        }
    </ChakraProvider>
}
