import React from 'react';
import Helmet from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import style from './style.scss';
import animate from '../../../style/animate.scss';

class About extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const birth = moment(this.props.data.birth).format('D MMMM Y');

        return (
            <div className={[style.container, animate.animated, animate.fadeIn].join(' ')}>
                <Helmet>
                    <title>{this.props.match.params.username}</title>
                </Helmet>
                <div>
                    <blockquote>
                        {this.props.data.quote}
                    </blockquote>
                </div>
                <div className={style.item}>
                    <h3><FontAwesomeIcon icon="map-marker-alt" /></h3>
                    <span>{this.props.data.country}</span>
                </div>
                <div className={style.item}>
                    <h3><FontAwesomeIcon icon={['far', 'calendar']} /></h3>
                    <span>{birth}</span>
                </div>
                <div className={style.item}>
                    <h3><FontAwesomeIcon icon={this.props.data.gender === 'male' ? 'mars' : 'venus'} /></h3>
                    <span>{this.props.data.gender === 'male' ? 'Male' : 'Female'}</span>
                </div>
                <div className={style.item}>
                    <h3><FontAwesomeIcon icon={['far', 'envelope']} /></h3>
                    <span>{this.props.data.email}</span>
                </div>
            </div>
        );
    }
}

export default About;