import { ConnectButton } from 'web3uikit'

const Header = () => {
    return <header>
        👋 Hello ,
        <ConnectButton moralisAuth={false} />
    </header>;
};
export default Header;