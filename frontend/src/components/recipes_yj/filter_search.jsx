import React from 'react';
import FilterSearchItemContainer from './filter_search_item_container';

const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export default class FilterSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results: [],
      visible: false
    };

    this.update = this.update.bind(this);
    this.search = debounce((query) => this.search(query), 100); // Arrow function to ensure correct context
    this.handleClick = this.handleClick.bind(this);
    this.hitEnter = this.hitEnter.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
    document.addEventListener('keydown', this.hitEnter);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
    document.removeEventListener('keydown', this.hitEnter);
  }

  update(e) {
    this.setState({ query: e.target.value });
    this.search(e.target.value);
  }

  search(query) {
    console.log(this.props.searchIngredientByName); // Debug to check if the function is received
    if (query !== "") {
      this.props.searchIngredientByName(query)
        .then(res => {
          this.setState({ results: res.data, visible: true });
        })
        .catch(error => {
          console.error("Error during search: ", error);
        });
    } else {
      this.setState({ visible: false });
    }
  }

  handleClick(e) {
    if (!(this.node && this.node.contains(e.target))) {
      this.setState({ visible: false, query: "" });
    }
  }

  hitEnter(e) {
    if (e.key === "Enter" && this.props.modal) {
      this.setState({ visible: false, query: "" });
    }
  }

  clearSearch() {
    this.setState({ visible: false, query: "" });
  }

  render() {
    let results;
    if (this.state.results.length > 0) {
      results = this.state.results.map((ingredient, i) => {
        return (
          <FilterSearchItemContainer key={i} ingredient={ingredient} 
            addIngredient={this.props.addIngredient}
            clearSearch={this.clearSearch}/>
        );
      });
    } else {
      results = <li className="filter-search-li">No Matches</li>;
    }

    return (
      <div className="filter-search-box">
        <div className="filter-search-contain">
          <input type="text" value={this.state.query} 
            onChange={this.update} onClick={this.update}
            className="filter-text-input" placeholder="Search Ingredients"
          />
          {this.state.visible && <ul className="filter-search-ul" ref={node => this.node = node}>
            {results}
          </ul>}
        </div>
      </div>
    );
  }
}
