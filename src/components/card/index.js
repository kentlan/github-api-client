/*eslint camelcase: 0*/
import {h} from 'preact'
import PropTypes from 'proptypes'
import css from './style.scss'

export const Card = ({name, description, fork, stargazers_count, pushed_at, language, onClick}) => (
  <div class={css.card} onClick={onClick}>
    <div class={css.container}>
      <div class={css.name}>{name}</div>
      <div>{description}</div>
      {fork && <div>fork</div>}
      <div>Stars: {stargazers_count}</div>
      <div>{pushed_at}</div>
      <div>{language}</div>
    </div>
  </div>
)

Card.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  fork: PropTypes.bool,
  stargazers_count: PropTypes.string,
  pushed_at: PropTypes.string,
  language: PropTypes.string,
  onClick: PropTypes.func
}
