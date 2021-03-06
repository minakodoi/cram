import { SSession } from '../../api/session/session.js';
import { Profile } from '../../api/profile/profile.js';
import { _ } from 'meteor/underscore';

/**
 * A list of Stuff to pre-fill the Collection.
 * @type {*[]}
 */
const sessionSeeds = [
  { name: 'ICS314',
    time: '2016-10-25 12:00:00',
    place: 'ICSpace',
    sensei: 'Minako Doi',
    students: null,
    detail: 'The sunject we will be covering is Meteor.',
    owner: 'temp',
  },
];

/**
 * Initialize the Stuff collection if empty with seed data.
 */
if (SSession.find().count() === 0) {
  _.each(sessionSeeds, function seedSessions(session) {
    SSession.insert(session);
  });
}

Meteor.methods({
  newSess: function() {
    Profile.update({ notiS: "0" }, { $set: { notiS: "1" } });
  },
  watchSess: function() {
    const owner = Meteor.userId();
    Profile.update({ owner: owner, notiS: "1" }, { $set: { notiS: "0" } });
  },
});