var React = require('react');
var PropTypes = require('prop-types');
var axios = require('axios');
var Loading = require('./Loading');


class Search extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			subreddit: ""
		};

		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event){
		var value = event.target.value;

	    this.setState(function () {
	      return {
	        subreddit: value
	      }
	    });
	}

	handleSubmit(event) {
	    event.preventDefault();
	    this.props.onSubmit(
	      this.state.subreddit
	    );
    }

	render(){
		return(
			<form className="searchForm" onSubmit={this.handleSubmit}>
				<input 
					id="subreddit" 
					name="search"
					type="text" 
					placeholder="Enter a subreddit" 
					autoComplete="off"
					onChange={this.handleChange}/>
				<input type="submit" value="Submit"/>
			</form>
		)
	}
	
}

Search.PropTypes = {
	onSubmit: PropTypes.func.isRequired,
}

class Page extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			subreddit: "",
			blogs: null
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.handleSubmit(this.state.subreddit);
	}

	// handleChange(event){
	// 	var value = event.target.value;

	//     this.setState(function () {
	//       return {
	//         subreddit: value
	//       }
	//     });
	// }

	handleSubmit(subreddit){
	    axios.get(`http://www.reddit.com/${this.state.subreddit === "" ? "" : "r/"+this.state.subreddit}.json`)
		.then(res => {
			const blogs = res.data.data.children.map(obj => obj.data);
			this.setState({ subreddit: subreddit, blogs: blogs });
		});
	}	

	render(){
		var subreddit = this.state.subreddit;
		var redditComments = "http://www.reddit.com/r/";
		var counter = 1;
		return(
			<div>
				<Search className="searchForm" onSubmit={this.handleSubmit}/>

				<div className="column">
					<h1>
						{!subreddit &&
							subreddit
						}
					</h1>
					<ol className="list">
					{!this.state.blogs ? <Loading /> : 
						this.state.blogs.map(blog => 							
							<div className="card">
								<div className="content">
									<li key={blog.id} className="post">								
										<div className="left">										
											<div className="left scoreBlock">
											<br/>										
											<label className="score">{counter++}. {blog.score > 1000 ? (blog.score/1000).toFixed(1) + 'k' : blog.score}</label>
											<br/>
											</div>
											<div className="right">
											<img className="thumbnail" src={!blog.thumbnail ? 
												"" : 
												blog.thumbnail}
												alt="Missing"/>
												</div>
										</div>
										<div className="right postDetail">
											<a href={blog.url} className="title">{blog.title}</a><br/>
											<label className="author">Submitted by <em>{blog.author}</em> to r/{blog.subreddit}</label><br/>
											<a href= {redditComments + blog.subreddit + "/comments/" + blog.id + "/" + ((blog.title).toLowerCase()).split(' ').join('_')} 
											   className="comments">{blog.num_comments} comments
											</a>
										</div>										
									</li>								
								</div>							
							</div>
						)
					}
					</ol>
				</div>
			</div>
		)
	}
}


module.exports = Page;
