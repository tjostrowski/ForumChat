'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatEntrySchema = new Schema({
  created: {
		type: Date,
		default: Date.now
	},
  value: {
    type: String,
    default: '',
    trim: true,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'ChatUser'
  }
});

mongoose.model('ChatEntry', ChatEntrySchema);
