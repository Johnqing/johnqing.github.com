var createAjax = function() {
    var xhr = null;
    try {
        //IE系列浏览器
        xhr = new ActiveXObject("microsoft.xmlhttp");
    } catch (e1) {
        try {
            //非IE浏览器
            xhr = new XMLHttpRequest();
        } catch (e2) {
            window.alert("您的浏览器不支持ajax，请更换！");
        }
    }
    return xhr;
};
var ajax = function(conf) {
    // 初始化
    //type参数,可选
    var type = conf.type;
    //url参数，必填
    var url = conf.url;
    //data参数可选，只有在post请求时需要
    var data = conf.data;
    if(data){
        var dataArr = [];
        for(var key in data){
            dataArr.push(key + '=' + data[key]);
        }
        data = data.join('&');
    }
    //datatype参数可选
    var dataType = conf.dataType;
    //回调函数可选
    var success = conf.success;

    if (type == null){
        //type参数可选，默认为get
        type = "get";
        url += '?' + data;
    }
    if (dataType == null){
        //dataType参数可选，默认为text
        dataType = "text";
    }
    // 创建ajax引擎对象
    var xhr = createAjax();
    // 打开
    xhr.open(type, url, true);
    // 发送
    if (type == "GET" || type == "get") {
        xhr.send(null);
    } else if (type == "POST" || type == "post") {
        xhr.setRequestHeader("content-type",
            "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if(dataType == "text"||dataType=="TEXT") {
                if (success != null){
                    //普通文本
                    success(xhr.responseText);
                }
            }else if(dataType=="xml"||dataType=="XML") {
                if (success != null){
                    //接收xml文档
                    success(xhr.responseXML);
                }
            }else if(dataType=="json"||dataType=="JSON") {
                if (success != null){
                    //将json字符串转换为js对象
                    success(eval("("+xhr.responseText+")"));
                }
            }
        }
    };
};

//////////////////////////////////////////////////////////////////


var Nav = React.createClass({
    render: function(){
        console.log(this.props);
        var Nodes = this.props.nav.map(function (data) {
            return (
                <a class="extra" href="{data.url}">{data.title}</a>
            );
        });

        return(
            <div class="title">
                {Nodes}
            </div>
        )
    }
});

var List = React.createClass({
    render: function(){

        var Nodes = this.props.posts.map(function(post){
            return <li><span>{post.date}</span> &raquo; <a href="{post.url}">{post.title}</a></li>
        });

        return(
                <div class="posts-wrap">
                    <h2>Blog Posts</h2>
                    <ul class="list">
                        {Nodes}
                    </ul>
                </div>
        )
    }
});

var Links = React.createClass({
    render: function(){

        var Nodes = this.props.links.map(function(link){
            return <li><a href="{link.url}">{link.title}</a></li>
        });

        return(
                <div class="link-wrap">
                    <h2>Links</h2>
                    <ul class="list">
                        {Nodes}
                    </ul>
                </div>
        )
    }
});

var Forkme = React.createClass({
    render: function(){
        return (
            <a href="http://github.com/{this.props.author.github}">
                <img style="position: absolute; top: 0; right: 0; border: 0;" src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" />
            </a>
        )
    }
});


var App = React.createClass({

    loadListFromServer: function(){
        var _self = this;
        ajax({
            url: "/atom.json",
            dataType: "json",
            success: function(data){
                console.log('ajax', data);
                _self.setState({data: data});
            },
            error: function(err){
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    getInitialState: function() {
        console.log('init');
        return {data: {
            nav: [],
            posts: [],
            links: []
        }};
    },
    componentDidMount: function(){
        this.loadListFromServer();
    },
    render: function(){
        console.log('render', this.state);
        return (
            <div class="site">
                <h1 id="logo"><a href="/" class="animated flipInX">Liu Qing</a></h1>
                <Nav nav={this.state.data.nav} />
                <div id="home">
                    <List posts={this.state.data.posts} />
                    <Links links={this.state.data.links} />
                </div>
                <Forkme author={this.state.data.author} />

            </div>
        )

    }
});

React.render(<App />, document.body);