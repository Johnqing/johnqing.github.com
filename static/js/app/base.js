var ALink = React.createClass({
    handleClick: function(e){
        var node = e.target;
        this.props.onPostClick({
            href: node.href, 
            title: node.innerText
        });
        return false;
    },
    render: function(){
        var link = this.props.link;
        return <a href={link.url} className={link.className} onClick={this.handleClick}>{link.title}</a>
    }
});


var Head = React.createClass({
    render: function(){
        var title = this.props.author || '';
        if(title){
            title = title.title;
        }
        var data = {
            title: title,
            url: '/',
            className: 'animated flipInX'
        }

        return <h1 id="logo"><ALink link={data} /></h1>

    }
});

var Nav = React.createClass({
    render: function(){
        var nav = this.props.nav || [];

        var Nodes = nav.map(function (data) {
            data.className = 'extra';
            return <ALink link={data} onPostClick={this.props.onPostClick} />
        }.bind(this));

        return(
            <div className="title">
                {Nodes}
            </div>
        )
    }
});

var List = React.createClass({
    render: function(){
        var posts = this.props.posts || [];
        var Nodes = posts.map(function(post){
            post.className = '';
            return <li><span>{post.date}</span> &raquo; <ALink link={post}  onPostClick={this.props.onPostClick} /></li>
        }.bind(this));

        return(
                <div className="posts-wrap">
                    <h2>Blog Posts</h2>
                    <ul className="list">
                        {Nodes}
                    </ul>
                </div>
        )
    }
});

var Links = React.createClass({
    render: function(){
        var links = this.props.links || [];
        var Nodes = links.map(function(link){
            return <li><ALink link={link} /></li>
        });

        return(
                <div className="link-wrap">
                    <h2>Links</h2>
                    <ul className="list">
                        {Nodes}
                    </ul>
                </div>
        )
    }
});

var Forkme = React.createClass({
    render: function(){
        var url = this.props.author || '';
        if(url){
            url = url.github;
        }
        return (
            <a href={url}>
                <img className="forkme" src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" />
            </a>
        )
    }
});


var Post = React.createClass({
    render: function(){
        var content = this.props.content;
        if(!content) 
            return <div />;

        return (
            <div id="post">
                <h3>{content.title}</h3>
                <div className="content" dangerouslySetInnerHTML={{__html: content.text}} />  
            </div>    
            )
    }
});

var Home = React.createClass({
    render: function(){

        if(!this.props.posts)
            return <div />;

        return (
            <div id="home">
                <List posts={this.props.posts}  onPostClick={this.props.onPostClick} />
                <Links links={this.props.links}  onPostClick={this.props.onPostClick} />
            </div>            
            )
    }
});

var CommonData = {};

var App = React.createClass({
    handlePostClick: function(data){
        ajax({
            url: data.href,
            success: function(_data){
                this.setState({
                    content: {
                        title: data.title,
                        text: _data
                    },
                    data: {}
                });
            }.bind(this)
        });
    },
    closePostClick: function(){
        this.loadListFromServer();
    },
    loadListFromServer: function(){
        ajax({
            url: this.props.url,
            dataType: "json",
            success: function(data){
                CommonData.author = data.author;
                CommonData.nav = data.nav;
                this.setState({
                    content: null,
                    data: data
                });
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: {}};
    },
    componentDidMount: function(){
        this.loadListFromServer();
    },
    render: function(){
        return (
            <div className="site">
                <Head author={CommonData.author} />
                <Nav nav={CommonData.nav} onPostClick={this.handlePostClick} />
                <Home posts={this.state.data.posts} links={this.state.data.links} onPostClick={this.handlePostClick} />
                <Post content={this.state.content} onClosePostClick={this.closePostClick} />
                <Forkme author={CommonData.author} />
            </div>
        )

    }
});

React.render(<App url="/atom.json" />, document.body);