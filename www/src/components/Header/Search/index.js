import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style.scss';
import animate from '../../../style/animate.scss';


class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = { search: '' };

        this.submit = this.submit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    handleSearch(e){
        this.setState({ search: e.target.value });
    }

    async submit(e){
        if (e.keyCode === 13 && this.state.search.length) {
            this.props.history.push(`/search/${this.state.search}`);
        }
    }

    clearSearch(e){
        this.setState({ search: '' });
    }

    render(){
        return (
            <div className={style.search}>
                <input 
                    onKeyUp={this.submit} 
                    onChange={this.handleSearch} 
                    value={this.state.search} 
                    type='text' 
                    placeholder="Search for user" 
                />
                {
                    this.state.search !== '' && 
                        <FontAwesomeIcon onClick={this.clearSearch} icon={['far', 'times-circle']} className={[animate.animated, animate.fadeIn].join(' ')} />
                }
            </div>
        );
    }
}

export default Search;