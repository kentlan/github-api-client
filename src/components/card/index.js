/*eslint camelcase: 0*/
import {Component, PropTypes} from 'preact'

export default class Card extends Component {

  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    fork: PropTypes.string,
    stargazers_count: PropTypes.string,
    updated_at: PropTypes.string,
    language: PropTypes.string
  }

  render() {
    const {name, description, fork, stargazers_count, updated_at, language} = this.props
    return (
      <div>
        <div>{name}</div>
        <div>{description}</div>
        <div>{fork}</div>
        <div>{stargazers_count}</div>
        <div>{updated_at}</div>
        <div>{language}</div>
        <br/>
        <br/>
      </div>
    )
  }
}
