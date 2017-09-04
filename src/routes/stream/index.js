/*eslint camelcase: 0*/
import {h, Component} from 'preact'
import style from './style.scss'
import {Card, FiltersPanel, SortPanel, Search} from '../../components'
import PropTypes from 'proptypes'
import _ from 'lodash'

class Stream extends Component {

  static propTypes = {
    repositories: PropTypes.array,
    openRepoDetails: PropTypes.func,
    user: PropTypes.string,
    search: PropTypes.func
  }

  state = {
    filters: {
      hasIssues: false,
      hasTopics: false,
      starred: 0,
      updated: '',
      type: 'All',
      language: 'All'
    },
    sortBy: 'Repo name',
    sortOrder: 'desc'
  }

  componentWillMount() {
    const {user, search} = this.props
    search(user)
  }

  componentWillReceiveProps(nextProps) {
    const {user, search} = this.props
    user !== nextProps.user && search(user)
  }

  getLanguages = repos => {
    const languages = repos.map(({language}) => language).filter(language => language !== null)
    const result = languages.reduce((uniqueLanguages, lang) => {
      if (!uniqueLanguages.includes(lang)) {
        uniqueLanguages.push(lang)
      }
      return uniqueLanguages
    }, ['All'])
    return result
  }

  changeFilter = (name, value) => {
    const {filters} = this.state
    this.setState({filters: {...filters, [name]: value}})
  }

  changeSorting = sortType => {
    this.setState({sortBy: sortType})
  }

  changeSortOrder = () => {
    const sortOrder = this.state.sortOrder === 'asc'
      ? 'desc'
      : 'asc'
    this.setState({sortOrder})
  }

  filterRepo = ({open_issues_count, topics, stargazers_count, pushed_at, fork, language}) => {
    const {filters} = this.state
    const filterTypes = {
      hasIssues: value => value ? open_issues_count > 0 : true,
      hasTopics: value => value ? topics.length > 0 : true,
      starred: value => stargazers_count >= value,
      updated: value => value === '' ? true : new Date(pushed_at) > new Date(value),
      type: value => {
        if (value === 'Forks') {
          return fork
        }
        if (value === 'Sources') {
          return !fork
        }
        return true
      },
      language: value => value === 'All' ? true : language === value
    }

    const result = _.map(filters, (value, name) => filterTypes[name](value))
    return result.every(value => value)
  }

  getSortFunction = (repo1, repo2) => {
    const {sortBy} = this.state
    const sortTypes = {
      'Repo name': () => {
        const text1 = repo1.name.toUpperCase()
        const text2 = repo2.name.toUpperCase()
        if (text1 < text2) {
          return -1
        }
        if (text1 > text2) {
          return 1
        }
        return 0
      },
      'Stars count': () => repo2.stargazers_count - repo1.stargazers_count,
      'Open issues count': () => repo2.open_issues_count - repo1.open_issues_count,
      'Updated date': () => new Date(repo2.updated_at) - new Date(repo1.updated_at)
    }
    return sortTypes[sortBy]()
  }

  render({openRepoDetails, repositories, user}, {sortOrder, filters, sortBy}) {
    repositories.sort(this.getSortFunction)
    sortOrder === 'asc' && repositories.reverse()
    const filteredRepos = repositories.filter(repo => this.filterRepo(repo))
    return (
      <div>
        <Search onSubmit={this.search} value={user}/>

        {repositories.length
          ? (
            <div>
              <FiltersPanel
                filters={filters}
                languages={this.getLanguages(repositories)}
                changeFilter={this.changeFilter}/>
              <SortPanel
                sortBy={sortBy}
                changeSorting={this.changeSorting}
                changeSortOrder={this.changeSortOrder}
                sortOrder={sortOrder}/>
            </div>
          )
          : null
        }
        {filteredRepos.length
          ? <div class={style.repositories}>
            {filteredRepos.map((repository, key) => (
              <Card
                {...repository}
                onClick={() => openRepoDetails(key)}
                key={repository.id}
              />
            ))}
          </div>
          : null}
      </div>
    )
  }
}


export default Stream