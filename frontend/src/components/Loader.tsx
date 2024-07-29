import {Oval} from 'react-loader-spinner'

type LoaderProps = {
    color:string;
    width:string;
    height:string;
}

const Loader = ({color,width,height}:LoaderProps) => {
  return (
    <>
    <Oval
        visible={true}
        color={color}
        secondaryColor='white'
        height={height}
        width={width}
    />
    </>
  )
}

export default Loader