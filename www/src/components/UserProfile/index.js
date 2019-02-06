import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.scss';
import animate from '../../style/animate.scss';
import { Parallax } from 'react-parallax';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import AddFriendButton from '../AddFriendButton';
import ProfileImage from '../ProfileImage';
import fetch from 'isomorphic-fetch';
import { getToken } from '../../utils/token';
import { addNewImage } from '../../store/actions/user';
import Loader from '../Loader';
import { newAlert } from '../../store/actions/alert';

class UserProfile extends React.Component {
    constructor(props){
        super(props);

        this.state = { uploading: false };

        this.file = React.createRef();
        this.imageUploadHandler = this.imageUploadHandler.bind(this);
        this.imageUpload = this.imageUpload.bind(this);
    }

    imageUploadHandler(){
        if (!this.state.uploading) {
            this.file.current.click();
        }
    }

    imageUpload(e){
        let img = e.target.files[0];
        if (img) {

            this.setState({ uploading: true });

            let fd = new FormData();
            fd.append('image', img, img.name);

            fetch(
                process.env.API_URL + '/api/v1/images',
                {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: fd
                }
            )
            .then( res => res.json( ) )
            .then( res => {
                if (res.id) {
                    this.props.newAlert('Image Uploaded !');
                    this.setState({ uploading: false });
                    this.props.addNewImage(res);
                }
            });

        }
    }

    render(){
        return(
            <div className={[style.container, animate.fadeIn, animate.animated].join(' ')}>
            
                <header>
                    <Parallax
                        //bgImage={'https://images.pexels.com/photos/1114897/pexels-photo-1114897.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1500'} 
                        //bgImage={this.props.user.background ? this.props.user.background.src : '/static/bg.jpeg' } 
                        bgImage={
                            this.props.user.background ?
                                this.props.client && this.props.client.id === this.props.user.id ?
                                    this.props.client.background.src
                                :
                                    this.props.user.background.src
                            :
                                '/static/bg.jpeg'
                        } 
                        strength={400}
                        style={{height: '100%'}}
                    />    
                    <div className={style.overlay} />

                    {
                        this.props.client && this.props.client.id === this.props.user.id ?
                            <span onClick={this.imageUploadHandler} className={style.bg}>
                                <input onChange={this.imageUpload} ref={this.file} type="file" style={{display: 'none'}} />
                                {
                                    this.state.uploading ?
                                        <Loader size="28px" color="white" />
                                    :
                                        <><FontAwesomeIcon icon="camera" /> Upload Image</>
                                }
                            </span>
                        :
                            <span>
                                <AddFriendButton user={this.props.user} />
                            </span>
                    }
                    
                    <Link to={`/user/${this.props.user.username}`}>
                        {
                            this.props.client && this.props.client.id === this.props.user.id ?
                                <ProfileImage 
                                    gender={this.props.user.gender} 
                                    src={this.props.client.avatar}
                                />
                            :
                                <ProfileImage 
                                    gender={this.props.user.gender} 
                                    src={this.props.user.avatar}
                                />
                        }
                    </Link>
                    {   
                        this.props.client && this.props.client.id === this.props.user.id && 
                            <div className={style.profileLinkWrapper}>
                                {/*<span onClick={this.imageUploadHandler} className={style.changeProfileImage}>
                                    <FontAwesomeIcon icon={['far', 'images']} />
                                </span>*/}
                                <Link to={`/user/${this.props.client.username}/images`} className={style.profileLink}>
                                    <FontAwesomeIcon icon={['far', 'images']} />
                                </Link>
                            </div>
                    }
                </header>
                
                <div className={style.username}>
                    { this.props.user.name }
                </div>
                
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    client: state.user
});

const mapDispatchToProps = {
    addNewImage,
    newAlert
}

//export default UserProfile;

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);