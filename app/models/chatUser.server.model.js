'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatUserSchema = new Schema({
  nick: {
    type: String,
    required: true
  },
  roles: {
    type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
  }
});

mongoose.model('ChatUser', ChatUserSchema);
