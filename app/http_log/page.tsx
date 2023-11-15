'use client'

import {ChakraProvider, Table, Tbody, Td, Text, Thead, Tr, useToast} from "@chakra-ui/react";
import HeaderNav from "@/components/headerNav";
import CopyToClipboard from "@uiw/react-copy-to-clipboard";
import {BiSolidCopy} from "react-icons/bi";
import styles from "@/components/styles/itemStyle.module.css";
import ReactPaginate from "react-paginate";
import {useEffect, useState} from "react";

export default function LogsPage(){
    const [logs,setLogs] = useState([]) as any[];
    const [currentPage,setCurrentPage] = useState(0)
    const [totalPage,setTotalPage] = useState(1)
    const toast = useToast()
    const loadPage = (page:number)=>{
        fetch("/api/v3/http_log/page?page="+page).then(resp=>resp.json()).then(data=>{
            console.log("data:",data)
            setLogs(data["data"]["items"]);
            setTotalPage(data["data"]["total_page"])
        });
    }
    const handlePage=(event:any)=>{
        console.log(event)
        console.log(event.selected)
        setCurrentPage(event.selected)
        loadPage(event.selected+1)
    }
    useEffect(() => {
        loadPage(1)
    },[])
    const copied = ()=>{
        toast({
            title: "copy success",
            description: "your cookie info  has been copied to clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position:"top"
        })
    }
    return <>
        <ChakraProvider>
            <HeaderNav/>
            <div className={"p-4"}>

                <Text fontSize={"2xl"} className={"m-4 text-center"} >logs</Text>
                <Table colorScheme={"teal"}  variant='striped' style={{width:"85%",margin:"0 auto"}} >
                    <Thead>
                        <Tr>
                            <Td>
                                id
                            </Td>
                            <Td>
                                end_point_id
                            </Td>
                            <Td>
                                url
                            </Td>
                            <Td>
                                md5
                            </Td>
                            <Td>
                                cookie
                            </Td>
                        </Tr>

                    </Thead>
                    <Tbody>
                        {logs.map((item:any)=><>
                            <Tr>
                                <Td>
                                    {item.id}
                                </Td>
                                <Td>
                                    {item.end_point_id}
                                </Td>
                                <Td>
                                    <CopyToClipboard  text={item.http_request}
                                                      onClick={copied} background={"none"}
                                                      style={{display:"inline-block"}}>
                                        <BiSolidCopy className={styles.svgIcon} size={20}/>
                                    </CopyToClipboard>
                                    <span className={"w-64"} style={{width:"300px",display:"inline-block",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
{item.http_request}
            </span>


                                </Td>
                                <Td>
                                    {item.md5}
                                </Td>
                                <Td>
                                    <CopyToClipboard  text={item.cookie}
                                                      onClick={copied} background={"none"}
                                                      style={{display:"inline-block"}}>
                                        <BiSolidCopy className={styles.svgIcon} size={20}/>
                                    </CopyToClipboard>
                                    <span className={"w-64"} style={{width:"300px",display:"inline-block",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
 {item.cookie}
            </span>

                                </Td>
                            </Tr>
                        </>)}
                    </Tbody>
                </Table>

                <ReactPaginate
                    className={"m-4 ml-32"}
                    activeClassName="active-page"  forcePage={currentPage} pageCount={totalPage} onPageChange={handlePage}/>

            </div>
        </ChakraProvider>
    </>
}
