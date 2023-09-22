import {Progress, Stack, Tooltip} from "@chakra-ui/react";
import {configureAbly, useChannel} from "@ably-labs/react-hooks";
import {useEffect, useState} from "react";

interface StepAndProgressProps {
    name?: string;
    onFinish:(result:string)=>void;
}
const SystemPresetColors = [
    'red',
    'purple',
    'cyan',
    'whatsapp',
    'blue',
    'orange',
    'messenger',
    'green',
    'facebook',
    'pink',
    'gray',
    'yellow',
    'twitter',
    'linkedin',
    'teal',
    'telegram'
]
export default function MultiStepProgress(props:StepAndProgressProps){
    const {name,onFinish} = props
    const [finished,SetFinished] = useState(false)
    const [wholePercent,setWholePercent] = useState(1)
    const steps = [
        { stage_name: 'First', description: 'Contact Info' ,percent:1}
    ]
    const [allSteps,setAllSteps]=useState(steps)
// For the full code sample see here: https://github.com/ably/quickstart-js
    configureAbly({ key: "r_fSNQ.NOV6Xg:N9Ao_SuWHzm2k5YY1uiJ2_KVPsOPUsVj53fuBzS249c"});
    //const ably = new Realtime.Promise('r_fSNQ.NOV6Xg:N9Ao_SuWHzm2k5YY1uiJ2_KVPsOPUsVj53fuBzS249c');
    const [channel, ably] = useChannel('progress-'+name, (msg) => {
        console.log('Received: ' , msg.data,msg.data.status);
        if(msg.data.status==1){
            //已经完成了，通知回调;
            console.log("try to call onFinish props")
            if(onFinish && !finished){
                SetFinished(true)
                setTimeout(()=> {
                    onFinish(msg.data.result)
                },200)
                console.log("close ably")
                ably.close()
            }
        }
        setAllSteps(msg.data.stages)
    });
    const initData = ()=>{
        if(name) {
            fetch("/api/v3/job?name=" + name).then((res) => {
                return res.json()
            }).then((data) => {
                console.log("init data", data)
                console.log("stages",data.stages)
                setAllSteps(data.stages)
                setWholePercent(data.percent)
            })
        }
    }
    useEffect(()=> {
        //await ably.connection.once('connected');
        initData();
        SetFinished(false)
    },[name]);
    console.log('Connected to Ably!,name:',name);
    function getRoundClass(index:number,length:number){
        if(index==0){
            return " rounded-l-md"
        }
        if(index==length-1){
            return " rounded-r-md"
        }
        return ""
    }

    return <>
    { name?
        <>
        {allSteps.length>1?
            <Stack direction={['column', 'row']} spacing='.5px'>
                {allSteps.map((stage, index) => (
                    <Tooltip label={stage.description+","+stage.percent+"%"} key={stage.stage_name}>
                        <Progress hasStripe colorScheme={SystemPresetColors[index]} size='lg' value={stage.percent}  className={" border-gray-200" + getRoundClass(index,allSteps.length)} height='16px' >{stage.stage_name}</Progress>
                    </Tooltip>
                ))}

            </Stack> :
            <>
                <Progress hasStripe colorScheme='green' size='lg' value={wholePercent}  className={" border-gray-200"} height='12px' />
            </>}
        </>
        :<></>
    }
    </>
}
