import { ConnectButton } from 'web3uikit'

const Header = () => {
    return <header>
        <ConnectButton moralisAuth={false} />
    </header>;
};
export default Header;