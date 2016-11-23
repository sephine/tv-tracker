var SearchResults = React.createClass({
  propTypes: {
    searchText: React.PropTypes.string.isRequired,
    results: React.PropTypes.array.isRequired,
    count: React.PropTypes.number.isRequired,
    completed: React.PropTypes.bool.isRequired
  },

  componentWillMount: function () {
    window.addEventListener("scroll", this.handleScroll);
    NProgress.start();
  },

  componentDidUpdate: function () {
    var proportionDone = this.props.results.length/this.props.count;
    NProgress.set(proportionDone);
  },

  componentWillUnmount: function() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  handleScroll: function (e) {
    if ($(window).scrollTop() > 20) {
      $('.search-header').fadeOut();
    } else {
      $('.search-header').fadeIn();
    }
  },

  findTopPickID: function () {
    var topPickID = null;
    var topPickScore = 0
    for (let item of this.props.results) {
      if (item.seriesName != null && item.seriesName.toLowerCase().split("(")[0].trim() == this.props.searchText.toLowerCase().trim() &&
          (topPickID == null || item.ratingCount > topPickScore)) {
        topPickID = item.tvdb_ref;
        topPickScore = item.ratingCount;
      }
    }
    return topPickID;
  },

  createTopPick: function (topPickID) {
    for (let i = 0; i < this.props.results.length; i++) {
      let item = this.props.results[i];
      if (item.tvdb_ref == topPickID && item.posters.length != 0) {
        var bestRating = -1
        var bestThumbnail;
        for (let poster of item.posters) {
          if (poster.rating_average > bestRating) {
            bestRating = poster.rating_average;
            bestThumbnail = poster.thumbnail;
          }
        }

        var hyphenName = "";
        if (item.seriesName != null) {
          hyphenName = item.seriesName.split(" ").join("-").toLowerCase();
        }
        return (
          <div className="top-pick">
            <div className="container">
              <span className="col-xs-3 col-sm-1 col-md-1" />
              <div className="col-xs-6 col-sm-4 col-md-3">
                <a href={"/" + item.tvdb_ref + "/" + hyphenName}
                    id={"search-result-id-"+i}>
                  <div className="thumbnail">
                    <img src={"http://thetvdb.com/banners/" + bestThumbnail} alt={item.seriesName} />
                  </div>
                </a>
              </div>
              <span className="col-xs-3 hidden-sm" />
              <div className="col-xs-12 col-sm-6 col-md-7">
                <h2>{item.seriesName}</h2>
                {item.genre != null && item.genre != "" &&
                    <p><b>{item.genre}</b></p>}
                {item.overview != null && item.overview != "" &&
                    <p>{item.overview.truncateOnWord(500)}</p>}
              </div>
              <span className="hidden-xs col-sm-1 col-md-1" />
            </div>
          </div>
        );
      }
    }
    return null;
  },

  createThumbnails: function () {
    if (this.props.completed && this.props.count == 0) {
        return (
          <div className="all-results">
            <div className="container" style={{'text-align': 'center'}}>
              <h3>No Results Found</h3>
            </div>
          </div>
        );
    } else if (!this.props.completed || this.props.results.length < this.props.count) {
      return null;
    }

    var _this = this;
    var topPickID = this.findTopPickID();
    var inner = this.props.results.map(function(item, index){
      if (item.tvdb_ref == topPickID && item.posters.length != 0) {
        return null;
      }
      var bestRating = -1
      var bestThumbnail;
      for (let poster of item.posters) {
        if (poster.rating_average > bestRating) {
          bestRating = poster.rating_average;
          bestThumbnail = poster.thumbnail;
        }
      }

      var hyphenName = "";
      if (item.seriesName != null) {
        hyphenName = item.seriesName.split(" ").join("-").toLowerCase();
      }
      return (
        <div className="col-xs-4 col-sm-3 col-md-2"
            key={"search-result-id-"+index}>
          <a href={"/" + item.tvdb_ref + "/" + hyphenName}
              id={"search-result-id-"+index}>
            {bestThumbnail &&
                <div className="thumbnail">
                  <img src={"http://thetvdb.com/banners/" + bestThumbnail} alt={item.seriesName} />
                </div>}
            {!bestThumbnail &&
                <div className="no-image-div thumbnail">
                  <img src="/assets/NoThumbnailSearchImage.jpg" alt="no image" className="no-image-img" />
                  <div className="no-image-title">
                    <h4>{item.seriesName}</h4>
                  </div>
                </div>}
          </a>
        </div>
      );
    });

    var topPick = this.createTopPick(topPickID);
    if (topPick != null && this.props.results.length == 1) {
      return topPick;
    }

    var mainResultsClass = "all-results";
    if (topPick != null) {
      mainResultsClass = "other-results";
      $('.page-filler').addClass("list-background");
    }

    return (
      <div>
        {topPick}
        <div className={mainResultsClass}>
          <div className="container">
            <div className="row">
              {inner}
            </div>
          </div>
        </div>
      </div>
    );
  },

  render: function () {
    console.log(this.props.results);
    return (
      <div>
        <div className="search-header">
          <div className="container">
            <h3>Search Results for <b>{this.props.searchText}</b></h3>
          </div>
        </div>
        {this.createThumbnails()}
      </div>
    );
  }
});
