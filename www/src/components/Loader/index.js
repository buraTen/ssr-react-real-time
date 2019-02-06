import React from 'react';
import style from './style.scss';

class Loader extends React.Component {
    render(){
        return (
            <div 
                className={style.container} 
                style={{
                    width: this.props.size,
                    height: this.props.size,
                    borderTopColor: this.props.color
                }}
            />
        );
    }
}

export default Loader;