import React from 'react';
import Helmet from 'react-helmet';
import style from './style.scss';
import animate from '../../../style/animate.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { changeTheAvatar, changeTheBackground } from '../../../store/actions/user';

class Images extends React.Component {
    constructor(props){
        super(props);
    }

    changeAvatar(avatar){
        this.props.changeTheAvatar(avatar);
    }

    changeBackground(background){
        this.props.changeTheBackground(background);
    }

    render(){
        return (
            <div className={[style.container, animate.animated, animate.fadeIn].join(' ')}>
                <Helmet>
                    <title>Images - {this.props.match.params.username}</title>
                </Helmet>

                {
                    this.props.data.map(image => 
                        <div className={[style.image, animate.animated, animate.fadeIn].join(' ')} key={image.id}>
                            <img src={image.src250} />
                            <div className={style.inner}>
                                <a className={[style.item, style.zoom].join(' ')} href={image.src} target="_blank">
                                    <FontAwesomeIcon icon="search-plus" />
                                </a>
                                {
                                    this.props.client && image.user === this.props.client.id &&
                                        <>

                                            {
                                                this.props.client.avatar && this.props.client.avatar.src250 !== image.src250 || !this.props.client.avatar ? 
                                                    <div 
                                                        className={[style.item, style.avatar].join(' ')} 
                                                        title="Set as avatar" 
                                                        onClick={this.changeAvatar.bind(this, image)}
                                                    >
                                                        <FontAwesomeIcon icon={['far', 'image']} />
                                                    </div>
                                                : 
                                                    <></>
                                            }

                                            {
                                                this.props.client.background && this.props.client.background.src !== image.src || !this.props.client.background ? 
                                                    <div 
                                                        className={[style.item, style.background].join(' ')}  
                                                        title="Set as background image"  
                                                        onClick={this.changeBackground.bind(this, image)}
                                                    >
                                                        <FontAwesomeIcon icon={['far', 'images']} />
                                                    </div>
                                                : 
                                                    <></>
                                            }
                                            <div className={[style.item, style.delete].join(' ')}>
                                                <FontAwesomeIcon icon="times" />
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    client: state.user
});

const mapDispatchToProps = {
    changeTheAvatar,
    changeTheBackground
}

export default connect(mapStateToProps, mapDispatchToProps)(Images);