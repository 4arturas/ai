const { Button } = antd;

function Counter() {
    const [count, setCount] = React.useState(0);
    const { appContext, setAppContext } = React.useContext(AppContext);

    const handleClick = () => {
        setCount(count + 1);
        setAppContext( { ...appContext, activeTabKey: "1" } );
    };
    return (
        <div>
            <Button type="primary" onClick={handleClick} config={{ prefixCls: 'no-wave' }}>
                Click me!
            </Button>
            <p>Button clicked {count} times</p>
        </div>
    );
}