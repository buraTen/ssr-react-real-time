import React from 'react';
import Helmet from 'react-helmet';
import style from './style.scss';
import animate from '../../style/animate.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { signIn, signUp, getCountries } from '../../api';
import { setToken } from '../../utils/token';
import { connect } from 'react-redux';
import { newAlert } from '../../store/actions/alert';
import Loader from '../../components/Loader';

const customStyles = {
    control: () => ({
        borderRadius: 3,
        backgroundColor: 'white',
        display: 'flex',
        boxShadow: '0px 0px 1px 1px rgba(0,0,0,.13)',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        height: 45,
        fontSize: 14
    }),
    dropdownIndicator: provided => ({
        ...provided,
        paddingRight: 3
    }),
    indicatorSeparator: () => {}
  }

class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = { form: 'signIn', isLoading: false, countries: null };

        this.setForm = this.setForm.bind(this);
        this.submit = this.submit.bind(this);
    }

    setForm(form){
        this.setState({ form });
    }

    async submit(e){
        e.preventDefault();
        
        this.setState({ isLoading: true });

        switch (this.state.form) {
            case 'signUp':
                let signUpForm = {
                    first: e.target.first.value,
                    last: e.target.last.value,
                    username: e.target.username.value,
                    email: e.target.email.value,
                    gender: e.target.gender.value,
                    password: e.target.password.value,
                    day: e.target.day.value,
                    month: e.target.month.value,
                    year: e.target.year.value,
                    country: e.target.country.value
                };
                
                let response = await signUp(signUpForm);
                if (response.errors.length) {
                    this.props.newAlert(null, response.errors);
                } else {
                    this.props.newAlert('Signed Up');
                    this.setState({ form: 'signIn' });
                }
                this.setState({ isLoading: false });
                break;
        
            case 'signIn':
                let user = { username: e.target.username.value, password: e.target.password.value };
                let { token } = await signIn(user);
                
                if (token) {
                    setToken(token);
                    window.location.reload();
                } else {
                    this.setState({ isLoading: false });
                    this.props.newAlert('Wrong username or password');
                }

                break;
        }

    }

    async componentDidMount(){
        let countries = await getCountries();
        this.setState({ countries });
    }

    signIn(){
        return (
            <div className={[animate.animated, animate.fadeIn].join(' ')}>
                <Helmet>
                    <title>Sign In</title>
                </Helmet>

                <div className={style.row}>
                    <h1>Sign In</h1>
                </div>

                <div className={style.row}>
                    <input type="text" name="username" placeholder="Username or E-mail" autoComplete="off" />
                    <FontAwesomeIcon className={style.icon} icon={['far', 'user']} />
                </div>

                <div className={style.row}>
                    <input type="password" name="password" placeholder="Password" />
                    <FontAwesomeIcon className={style.icon} icon="lock" />
                </div>
                                
                <div className={style.row}>
                    <input type="submit" value="Sign In" />
                </div>

                <div className={style.row}>
                    <span onClick={() => this.setForm('signUp')}>Not have an account ?</span>
                </div>
            </div>
        );
    }

    signUp(){
        let date = { day: [], month: [], year: [] };
        for (let i = 1; i <= 2018; i++) {
            if (i <= 31) {
                date.day.push({ label: i, value: i });
            }
            if (i <= 12) {
                date.month.push({ label: i, value: i });
            }
            if (i <= 2000 && i > 1940) {
                date.year.push({ label: i, value: i });
            }
        }
        
        return (
            <div className={[animate.animated, animate.fadeIn].join(' ')}>
                <Helmet>
                    <title>Sign Up</title>
                </Helmet>

                <div className={style.row}>
                    <h1>Sign Up</h1>
                </div>
                    
                <div className={[style.row, style.row2].join(' ')}>
                    <input type="text" name="first" placeholder="Firstname" autoComplete="off" />
                    <FontAwesomeIcon className={style.icon} icon={['far', 'user']} />
                    <input type="text" name="last" placeholder="Lastname" autoComplete="off" />
                    <FontAwesomeIcon className={style.icon} icon={['far', 'user']} />
                </div>

                <div className={style.row}>
                    <input type="text" name ="username" placeholder="Username"  autoComplete="off" />
                    <FontAwesomeIcon className={style.icon} icon={['far', 'user']} />
                </div>

                <div className={style.row}>
                    <input type="email" name ="email" placeholder="E-mail"  autoComplete="off" />
                    <FontAwesomeIcon className={style.icon} icon="at" />
                </div>

                <div className={[style.row, style.row3].join(' ')}>
                    <Select 
                        name="day" 
                        placeholder="Day" 
                        className={style.select} 
                        options={date.day} 
                        styles={customStyles}
                    />
                    <Select 
                        name="month" 
                        placeholder="Month" 
                        className={style.select} 
                        options={date.month} 
                        styles={customStyles} 
                    />
                    <Select 
                        name="year" 
                        placeholder="Year" 
                        className={style.select} 
                        options={date.year} 
                        styles={customStyles} 
                    />
                </div>

                <div className={[style.row, style.row2].join(' ')}>
                    <Select 
                        name="country" 
                        placeholder="Country" 
                        className={style.select} 
                        options={
                            this.state.countries ?
                                this.state.countries.map(country => 
                                    ({ value: country.code, label: country.name })
                                )
                            :
                                undefined
                        } 
                        isLoading={
                            !this.state.countries
                        } 
                        styles={customStyles} 
                    />
                    <Select 
                        name="gender" 
                        placeholder="Gender" 
                        className={style.select} 
                        options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]} 
                        styles={customStyles}
                    />
                </div>

                <div className={[style.row, style.row2].join(' ')}>
                    <input type="password" name="password" placeholder="Password" />
                    <FontAwesomeIcon className={style.icon} icon="lock" />
                    <input type="password" placeholder="Password Confirm" />
                    <FontAwesomeIcon className={style.icon} icon="lock" />
                </div>

                <div className={style.row}>
                    <input type="submit" value="Sign Up" />
                </div>

                <div className={style.row}>
                    <span onClick={() => this.setForm('signIn')}>Have an account ?</span>
                </div>
            </div>
        );
    }

    render(){
        return (
            <div className={style.container}>
                <div className={style.wrapper}>

                    <form onSubmit={this.submit} method="post">
                        
                        {
                            this.state.form === 'signIn' &&
                            this.signIn()
                        }

                        {
                            this.state.form === 'signUp' &&
                            this.signUp()
                        }

                        {
                            this.state.isLoading &&
                            <div className={[style.overlay, animate.animated, animate.fadeIn].join(' ')}>
                                <Loader />
                            </div>
                        }

                    </form>

                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    newAlert
};

export default connect(null, mapDispatchToProps)(SignIn);