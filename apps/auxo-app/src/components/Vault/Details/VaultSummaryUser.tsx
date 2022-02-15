import { Vault } from "../../../store/vault/Vault"
import { prettyNumber } from "../../../utils"
import CardItem from "../../UI/cardItem"
import WithdrawButton from "../Actions/Withdraw/WithdrawButton"


const VaultSummaryUser = ({ loading, vault }: {
    loading: boolean,
    vault: Vault | undefined
  }) => {
    return (
      <section className="
        flex flex-col w-full justify-evenly h-full items-center">
        <CardItem
            loading={loading}
            left={`Your Vault Token balance`}
            right={ prettyNumber(vault?.userBalances?.vault.label) }
        />
        <CardItem
            loading={loading}
            left="Last Harvested"
            right={ vault?.stats?.lastHarvest.toString() ?? 'N/A' }
        />
        <div className="
          h-[1px] bg-gray-300 w-full my-5"/>
        <CardItem
            loading={loading}
            left={`Your ${vault?.symbol} Wallet balance`}
            right={ prettyNumber(vault?.userBalances?.wallet.label) }
        />
        <CardItem
          loading={loading}
          left={`Shares Pending Withdrawal`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.shares.label ?? 0) }
        /> 
         <section className="flex justify-between items-center w-full my-1 text-gray-600">
            <p className="font-bold ml-2">Available to withdraw</p>
            <WithdrawButton />
        </section>
      </section>     
    )
  }

  export default VaultSummaryUser