import React from 'react';
import style from './style.scss';

class ProfileImage extends React.Component {
    constructor(props){
        super(props);

        let gender = this.props.gender || 'male';
        let src = this.props.src || null;
        if (src) {
            src = src.src250;
        } else {
            src = `/static/${gender}.png`;
        }
        
        this.state = { src, gender, error: false };

        this.onError = this.onError.bind(this);

    }

    onError(){
        this.setState({ error: true });
    }

    render(){

        return (
            <img 
                className={style.image} 
                src={
                    this.state.error ?
                        `/static/${this.props.gender || 'male'}.png`
                    :
                        this.props.src ?
                            this.props.src.src250
                        :
                            `/static/${this.props.gender || 'male'}.png`
                } 
                onError={this.onError}
            />
        );
    }
}

export default ProfileImage;