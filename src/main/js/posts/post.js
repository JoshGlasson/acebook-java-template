import React from 'react';
import Comment from './comment';
const client = require('../client');

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {comments: [], likes: [], userid: document.getElementById("userid").value, toggle: null, likeid: 0};
    console.log(this.state.userid);
    this.getComments = this.getComments.bind(this);
    this.id = this.props.post._links.self.href.split("/")[this.props.post._links.self.href.split("/").length-1];
    this.Likes= this.Likes.bind(this);
    client({method: 'GET', path: '/api/likes/search/findByPostid?postid=' + this.id}).then(response => {
              this.setState({likes: response.entity._embedded.likes.map(like => {return like.userid.toString();})});
              console.log(this.state.likes);
              this.state.toggle = this.state.likes.includes(this.state.userid);
         });
     client({method: 'GET', path: '/api/likes/search/findByPostidAndUserid?postid='+ this.id +'&userid='+ this.state.userid}).then(response => {
                    console.log(response.entity._embedded.likes[0]._links.self.href.split("/")[response.entity._embedded.likes[0]._links.self.href.split("/").length-1])
                    this.setState({likeid: response.entity._embedded.likes[0]._links.self.href.split("/")[response.entity._embedded.likes[0]._links.self.href.split("/").length-1]})
                    console.log(this.state.likeid)
                });
    }

  // response.entity._embedded.likes[0]._links.self.href.split("/")[response.entity._embedded.likes[0]._links.self.href.split("/").length-1]

  componentDidMount() {
    client({method: 'GET', path: '/api/comments/search/findByPostid?post_id=' + this.id}).then(response => {
      this.setState({comments: response.entity._embedded.comments});
    });
  }


render () {
	return (
		<div className='post-main'>
			<div className='post-content'>
				{this.props.post.content.split("\n").map((i,key) => {
                                               return <div key={key}>{i}</div>;
                                           })}

			</div>
			<div className='post-time'>
                {this.props.post.time_stamp}
            </div>
            <div className='post-likes'>
                <button onClick={this.Likes} type="button" class={this.state.toggle ? "btn btn-primary" : "btn btn-light"}>
                 {this.state.toggle ? 'Unlike' : 'Like'} {this.state.likes.length}
                </button>
            </div>
            <br>
             <h5>Comments</h5>
            <div className='comments-item'>
              				{this.getComments()}
              			</div>
            <a href={"post/"+this.id+"/comment"}>Comment!</a>
		</div>
	)
    }

     getComments() {
        console.log(this.state.toggle);

        return this.state.comments.map(comment =>
    			<Comment key={comment._links.self.href} comment={comment}/>
    		);
      }
//
//      buttonClass() {
//        return this.state.toggle ? "btn btn-primary" : "btn btn-light"
//      }

      Likes() {
      if(this.state.userid !== "") {
      if(this.state.toggle) {
      console.log("Pre Fetch")
      client({method: 'GET', path: '/api/likes/search/findByPostidAndUserid?postid='+ this.id +'&userid='+ this.state.userid}).then(response => {
               console.log(response.entity._embedded.likes[0]._links.self.href.split("/")[response.entity._embedded.likes[0]._links.self.href.split("/").length-1])
               this.setState({likeid: response.entity._embedded.likes[0]._links.self.href.split("/")[response.entity._embedded.likes[0]._links.self.href.split("/").length-1]})
               console.log(this.state.likeid)
               fetch('/api/likes/'+ this.state.likeid, {
                               method: 'DELETE',
                               headers: {
                                 'Accept': 'application/json',
                                 'Content-Type': 'application/json',
                               },
                             })
           });


              console.log("Post Fetch")
        this.state.likes.splice(this.state.likes.indexOf(this.state.userid));
      } else {
      console.log("Pre Fetch")

        fetch('/api/likes', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postid: this.id,
            userid: this.state.userid,
          })
        })
        console.log("Post Fetch")

        this.state.likes.push(this.state.userid);
      }
      return this.setState(state => ({toggle: !state.toggle}));
      }
      }


}
export default Post;


// props.post._links.self.href.split("/").length-1 gives us the 5th element of the array which is our post ID
