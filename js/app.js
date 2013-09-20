App = Ember.Application.create();

App.Artist = Ember.Object.extend({
  name: null,

  slug: function() {
    return this.get('name').dasherize();
  }.property('name'),

  songs: function() {
    return App.Songs.filterProperty('artist', this.get('name'));
  }.property('name', 'App.Songs.@each.artist')
});

App.Song = Ember.Object.extend({
  title: null,
  rating: null,
  artist: null
});

var artistNames = ['Pearl Jam', 'Led Zeppelin', 'Foo Fighters', 'Kaya Project', 'Radiohead', 'Red Hot Chili Peppers']
App.Artists = artistNames.map(function(name) { return App.Artist.create({ name: name }); })

App.Songs = Ember.A();

// Pearl Jam songs
App.Songs.pushObject(App.Song.create({ title: 'Yellow Ledbetter', artist: 'Pearl Jam', rating: 5 }));
App.Songs.pushObject(App.Song.create({ title: 'Animal', artist: 'Pearl Jam', rating: 4 }));
App.Songs.pushObject(App.Song.create({ title: 'Daughter', artist: 'Pearl Jam', rating: 5 }));
App.Songs.pushObject(App.Song.create({ title: 'State of Love and Trust', artist: 'Pearl Jam', rating: 5 }));
App.Songs.pushObject(App.Song.create({ title: 'Immortality', artist: 'Pearl Jam', rating: 3 }));
App.Songs.pushObject(App.Song.create({ title: 'Alive', artist: 'Pearl Jam', rating: 3 }));
App.Songs.pushObject(App.Song.create({ title: 'Given To Fly', artist: 'Pearl Jam', rating: 3 }));
App.Songs.pushObject(App.Song.create({ title: 'Inside Job', artist: 'Pearl Jam', rating: 4 }));

// Led Zeppelin songs
App.Songs.pushObject(App.Song.create({ title: 'Black Dog', artist: 'Led Zeppelin', rating: 4 }));
App.Songs.pushObject(App.Song.create({ title: 'Achilles Last Stand', artist: 'Led Zeppelin', rating: 5 }));
App.Songs.pushObject(App.Song.create({ title: 'Immigrant Song', artist: 'Led Zeppelin', rating: 4}));
App.Songs.pushObject(App.Song.create({ title: 'Whole Lotta Love', artist: 'Led Zeppelin', rating: 4}));

// Foo Fighters songs
App.Songs.pushObject(App.Song.create({ title: 'The Pretender', artist: 'Foo Fighters', rating: 3 }));
App.Songs.pushObject(App.Song.create({ title: 'Best of You', artist: 'Foo Fighters', rating: 5 }));

// Kaya Project songs
App.Songs.pushObject(App.Song.create({ title: 'Always Waiting', artist: 'Kaya Project', rating: 5 }));

App.Router.map(function() {
  this.resource('artists', function() {
    this.route('songs', { path: ':slug' });
  });
});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('artists');
  }
});

App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    return App.Artists;
  },
  actions: {
    createArtist: function() {
      var name = this.get('controller').get('newName');
      var artist = App.Artist.create({ name: name });
      App.Artists.pushObject(artist);
      this.get('controller').set('newName', '');
    }
  }
});

App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params) {
    return App.Artists.findProperty('slug', params.slug);
  },
  actions: {
    createSong: function() {
      var artist = this.controller.get('model.name');
      var title = this.controller.get('newTitle');
      var song = App.Song.create({ title: title, artist: artist });
      App.Songs.pushObject(song);
      this.controller.set('newTitle', '');
    }
  }
});

App.StarRating = Ember.View.extend({
  tagName: 'span',
  templateName: 'star-rating',
  rating: Ember.computed.alias('context.rating'),

  numStars: function() {
    return parseInt(this.get('maxRating'));
  }.property('maxRating'),

  fullStars: Ember.computed.alias('rating'),

  emptyStars: function() {
    return this.get('numStars') - this.get('fullStars');
  }.property('numStars', 'fullStars'),

  fullStarRatings: function() {
    return this.range(this.get('emptyStars') + 1, this.get('numStars') + 1)
  }.property('emptyStars', 'numStars'),

  emptyStarRatings: function() {
    return this.range(0, this.get('emptyStars'));
  }.property('emptyStars'),

  range: function(start, end) {
    var range = [];
    for (i = start; i < end; i++) {
      range.push(i);
    };
    return range;
  }
});

