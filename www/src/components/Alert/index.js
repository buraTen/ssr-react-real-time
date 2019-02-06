import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { removeAlert } from '../../store/actions/alert';
import style from './style.scss';
import animate from '../../style/animate.scss';

class Alert extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className={style.container}>
                {
                    this.props.alert &&
                    <div className={[style.alert, animate.animated, animate.fadeInUp].join(' ')}>
                        <div className={style.left}>
                            <FontAwesomeIcon icon="exclamation" />
                        </div>

                        <div className={style.center}>
                            {this.props.alert.html}
                            {
                                this.props.list &&
                                <ul> 
                                {
                                    this.props.alert.list.map((l, i) => 
                                        <li key={i}>
                                            - {l}
                                        </li>
                                    )
                                }
                                </ul>
                            }
                        </div>

                        <div className={style.right}>
                            <span onClick={this.props.removeAlert}>
                                <FontAwesomeIcon icon={['far', 'times-circle']} />
                            </span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    alert: state.alert
});

const mapDispatchToProps = {
    removeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);