'use client'
import {Table, Thead, Tbody, Tr, Td, Text, useToast, ChakraProvider} from "@chakra-ui/react";
import HeaderNav from "@/components/headerNav";
import {useEffect, useState} from "react";
import CopyToClipboard from "@uiw/react-copy-to-clipboard";
import {BiSolidCopy} from "react-icons/bi";
import styles from "@/components/styles/itemStyle.module.css";
import ReactPaginate from "react-paginate";

export default function CookiePage(){
    const [ck,setCk] = useState([]) as any[];
    const toast = useToast()

    const [currentPage,setCurrentPage] = useState(0)
    const [totalPage,setTotalPage] = useState(1)
    const handlePage=(event:any)=>{
        console.log(event)
        console.log(event.selected)
        setCurrentPage(event.selected)
        fetch("/api/v3/cookies/page?page="+(event.selected+1)).then(resp=>resp.json()).then(data=>{
            console.log("data:",data)
            setCk(data["data"]["items"]);
            setTotalPage(data["data"]["total_page"])
        });
    }

    useEffect(() => {
        fetch("/api/v3/cookies/page").then(resp=>resp.json()).then(data=>{
            console.log("data:",data)
            setCk(data["data"]["items"]);
            setTotalPage(data["data"]["total_page"])
        })
    }, []);
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

        <Text fontSize={"2xl"} className={"m-4 text-center"} >Cookies</Text>
        <Table colorScheme={"teal"}  variant='striped' style={{width:"85%",margin:"0 auto"}} >
            <Thead>
                <Tr>
                    <Td>
                        姓名
                    </Td>
                    <Td>
                        user id
                    </Td>
                    <Td>
                        角色Id
                    </Td>
                    <Td>
                        角色名称
                    </Td>
                    <Td>
                        cookie
                    </Td>
                </Tr>

            </Thead>
            <Tbody>
                {ck.map((item:any)=><>
                    <Tr>
                        <Td>
                            {item.realname}
                        </Td>
                        <Td>
                            {item.user_id}
                        </Td>
                        <Td>
                            {item.role_id}
                        </Td>
                        <Td>
                            {item.role_name}
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
