declare module 'react-simple-flowchart' {
    function Flowchart(props: {
        chartCode: string;
        options: any;
        onClick?: (value: string) => void;
    }): JSX.Element;

    export default Flowchart;
}