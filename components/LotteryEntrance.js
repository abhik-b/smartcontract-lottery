import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index"
import { useEffect, useState } from "react";
import { ethers } from "ethers"
import { useNotification } from "web3uikit";



const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const [entranceFee, setEntranceFee] = useState("")
    const [entranceFeeWei, setEntranceFeeWei] = useState("")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")



    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const dispatch = useNotification()


    const { runContractFunction: enterLottery, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFeeWei
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, functionName: "getEntranceFee", params: {}
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, functionName: "getNumberOfPlayers", params: {}
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, functionName: "getRecentWinner", params: {}
    })

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function (tx) {
        dispatch({
            type: "info",
            message: `Transaction Complete! \n ${tx}`,
            title: "Tx Notifications",
            position: "topR",
            icon: "🔔"
        })
    }

    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const numPlayersFromContract = (await getNumberOfPlayers()).toString()
        const recentWinnerFromContract = (await getRecentWinner()).toString()
        setEntranceFeeWei(entranceFeeFromContract)
        setNumPlayers(numPlayersFromContract)
        setRecentWinner(recentWinnerFromContract)
        setEntranceFee(ethers.utils.formatEther(entranceFeeFromContract))
        console.log(ethers.utils.formatEther(entranceFeeFromContract))
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    })

    return <div>
        <p>Hi from lottery entrance!</p>
        {lotteryAddress
            ?
            <>
                <button
                    className="bg-blue-500 hover:bg-blue-700 py-2 px-4 ml-auto rounded-md text-white"
                    onClick={
                        async function () {
                            console.log('clicked')
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (err) => console.log(err)
                            })
                        }
                    }
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ?
                        <div className="flex justify-center items-center gap-4">
                            <div>Entering ... </div>
                            <div className="spinner-border animate-spin border-b-2 w-4 h-4 border-1 rounded-full "></div>
                        </div>
                        :
                        <div >
                            <div>Enter Lottery</div>
                        </div>
                    }
                </button>
                <p>Lottery Entrance Fee : {entranceFee} ETH</p>
                <p>Lottery Number Of Players : {numPlayers}</p>
                <p>Lottery Recent Winner : {recentWinner} ETH</p>
            </>
            :
            <div>No lottery address detected</div>
        }


    </div>;
};
export default LotteryEntrance;